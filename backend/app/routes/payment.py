# FastAPI backend for Payment Management with Super Admin Access, Export to CSV/PDF, Filtering

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import csv
import io
from fpdf import FPDF

from app.database import get_db
from app.models.payment import Payment
from app.models.tenant import Tenant
from app.schemas.payment import PaymentOut
# from app.auth import get_current_user
from app.models.users import User

router = APIRouter(prefix="/payments", tags=["Payments"])


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

    query = db.query(
    Payment.id,
    Payment.invoice_id,
    Payment.amount,
    Payment.status,
    Payment.payment_method,
    Payment.due_date,
    Payment.date,
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
            query = query.filter(Payment.date >= now.replace(day=1))
        elif date_filter == "last_month":
            last_month = (now.replace(day=1) - timedelta(days=1)).replace(day=1)
            next_month = now.replace(day=1)
            query = query.filter(Payment.date >= last_month, Payment.date < next_month)
        elif date_filter == "this_quarter":
            quarter_start = datetime(now.year, (now.month - 1) // 3 * 3 + 1, 1)
            query = query.filter(Payment.date >= quarter_start)
        elif date_filter == "this_year":
            query = query.filter(Payment.date >= datetime(now.year, 1, 1))

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
        date=row.date,
    )
    for row in results
]

@router.get("/export/csv")
def export_csv(
    db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_user),
):
    # ensure_super_admin(current_user)
    payments = db.query(Payment).join(Tenant).add_columns(
        Payment.invoice_id, Tenant.company_name, Payment.amount, Payment.status, Payment.date
    ).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Invoice ID", "Tenant", "Amount", "Status", "Payment Date"])
    for p in payments:
        writer.writerow([p.invoice_id, p.company_name, p.amount, p.status, p.date])

    response = Response(content=output.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=payments.csv"
    return response


@router.get("/export/pdf")
def export_pdf(
    db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_user),
):
    # ensure_super_admin(current_user)
    payments = db.query(Payment).join(Tenant).add_columns(
        Payment.invoice_id, Tenant.company_name, Payment.amount, Payment.status, Payment.date
    ).all()

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Payment Report", ln=True, align="C")

    for p in payments:
        pdf.cell(200, 10, txt=f"{p.invoice_id} | {p.company_name} | {p.amount} | {p.status} | {p.date}", ln=True)

    output = io.BytesIO()
    pdf.output(output)
    response = Response(content=output.getvalue(), media_type="application/pdf")
    response.headers["Content-Disposition"] = "attachment; filename=payments.pdf"
    return response
