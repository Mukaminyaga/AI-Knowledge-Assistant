# FastAPI backend for Payment Management with Super Admin Access, Export to CSV/PDF, Filtering

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import csv
import io
from fpdf import FPDF
import logging

from app.database import get_db
from app.models.payment import Payment
from app.models.tenant import Tenant
from app.schemas.payment import PaymentOut, PaymentCreate, PaymentUpdate
# from app.auth import get_current_user
from app.models.users import User
from fastapi import status as http_status

router = APIRouter(prefix="/payments", tags=["Payments"])
logger = logging.getLogger(__name__)

# def ensure_super_admin(user: User):
#     if user.role != "super_admin":
#         raise HTTPException(status_code=403, detail="Not authorized")

@router.get("/", response_model=List[PaymentOut])
def get_all_payments(
    status: Optional[str] = Query(None),
    date_filter: Optional[str] = Query(None),
    tenant: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    now = datetime.utcnow()

    # Automatically mark overdue
    overdue_payments = db.query(Payment).filter(Payment.status != "paid", Payment.due_date < now).all()
    for p in overdue_payments:
        p.status = "overdue"
    db.commit()

    query = db.query(
        Payment.id,
        Payment.invoice_id,
        Payment.amount,
        Payment.status,
        Payment.payment_method,
        Payment.due_date,
        Payment.payment_date,
        Payment.tenant_id.label("tenant_id"),
        Tenant.company_name.label("tenant_name"),
        Tenant.contact_email.label("tenant_email"),
    ).join(Payment.tenant)

    if status:
        query = query.filter(Payment.status == status)
    if tenant:
        query = query.filter(Tenant.company_name.ilike(f"%{tenant}%"))
    if date_filter:
        if date_filter == "this_month":
            query = query.filter(Payment.payment_date >= now.replace(day=1))
        elif date_filter == "last_month":
            last_month = (now.replace(day=1) - timedelta(days=1)).replace(day=1)
            next_month = now.replace(day=1)
            query = query.filter(Payment.payment_date >= last_month, Payment.payment_date < next_month)
        elif date_filter == "this_quarter":
            quarter_start = datetime(now.year, (now.month - 1) // 3 * 3 + 1, 1)
            query = query.filter(Payment.payment_date >= quarter_start)
        elif date_filter == "this_year":
            query = query.filter(Payment.payment_date >= datetime(now.year, 1, 1))

    results = query.all()

    return [
        PaymentOut(
            id=row.id,
            invoice_id=row.invoice_id,
            tenant_id=row.tenant_id,
            tenant_name=row.tenant_name,
            tenant_email=row.tenant_email,
            amount=row.amount,
            status=row.status,
            payment_method=row.payment_method,
            due_date=row.due_date,
            payment_date=row.payment_date,
        )
        for row in results
    ]

@router.get("/export/csv")
def export_csv(db: Session = Depends(get_db)):
    payments = db.query(Payment).join(Tenant).add_columns(
        Payment.invoice_id, Tenant.company_name, Payment.amount, Payment.status, Payment.payment_date
    ).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Invoice ID", "Tenant", "Amount", "Status", "Payment Date"])
    for p in payments:
        writer.writerow([p.invoice_id, p.company_name, p.amount, p.status, p.payment_date])

    response = Response(content=output.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=payments.csv"
    return response

@router.get("/export/pdf")
def export_pdf(db: Session = Depends(get_db)):
    payments = db.query(Payment).join(Tenant).add_columns(
        Payment.invoice_id, Tenant.company_name, Payment.amount, Payment.status, Payment.payment_date
    ).all()

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Payment Report", ln=True, align="C")

    for p in payments:
        pdf.cell(200, 10, txt=f"{p.invoice_id} | {p.company_name} | {p.amount} | {p.status} | {p.payment_date}", ln=True)

    output = io.BytesIO()
    pdf.output(output)
    response = Response(content=output.getvalue(), media_type="application/pdf")
    response.headers["Content-Disposition"] = "attachment; filename=payments.pdf"
    return response

@router.put("/{payment_id}/mark-paid", response_model=PaymentOut)
def mark_payment_as_paid(
    payment_id: int,
    payment_data: PaymentUpdate,
    db: Session = Depends(get_db),
):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    payment.amount = payment_data.amount
    payment.payment_method = payment_data.payment_method
    payment.status = "paid"
    payment.payment_date = payment_data.payment_date or datetime.utcnow()

    db.commit()
    db.refresh(payment)

    tenant = db.query(Tenant).filter(Tenant.id == payment.tenant_id).first()

    return PaymentOut(
        id=payment.id,
        invoice_id=payment.invoice_id,
        tenant_id=payment.tenant_id,
        tenant_name=tenant.company_name,
        tenant_email=tenant.contact_email,
        amount=payment.amount,
        status=payment.status,
        payment_method=payment.payment_method,
        due_date=payment.due_date,
        payment_date=payment.payment_date,
    )

@router.post("/", response_model=PaymentOut, status_code=http_status.HTTP_201_CREATED)
def create_payment(
    payment_data: PaymentCreate,
    db: Session = Depends(get_db),
):
    logger.info(f"Received payment creation request: {payment_data}")

    try:
        payment = Payment(
            invoice_id=payment_data.invoice_id,
            tenant_id=payment_data.tenant_id,
            amount=payment_data.amount,
            payment_method=payment_data.payment_method,
            status=payment_data.status or "paid",
            payment_date=payment_data.payment_date or datetime.utcnow(),
            due_date=payment_data.due_date,
        )

        db.add(payment)
        db.commit()
        db.refresh(payment)
        logger.info(f"Payment {payment.id} committed to DB.")

        tenant = db.query(Tenant).filter(Tenant.id == payment.tenant_id).first()
        if not tenant:
            logger.warning(f"Tenant with ID {payment.tenant_id} not found.")
            raise ValueError("Tenant not found")

        response = PaymentOut(
            id=payment.id,
            invoice_id=payment.invoice_id,
            tenant_id=payment.tenant_id,
            tenant_name=tenant.company_name,
            tenant_email=tenant.contact_email,
            amount=payment.amount,
            status=payment.status,
            payment_method=payment.payment_method,
            due_date=payment.due_date,
            payment_date=payment.payment_date,
        )

        logger.info(f"Returning response: {response}")
        return response

    except Exception as e:
        logger.error(f"Failed to create payment: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
