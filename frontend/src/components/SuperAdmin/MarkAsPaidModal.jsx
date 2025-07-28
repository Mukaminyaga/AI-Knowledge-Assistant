import React, { useState, useEffect } from "react";
import { FiX, FiDollarSign, FiCreditCard, FiCalendar } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import "../../styles/SuperAdmin.css";

const API_URL = process.env.REACT_APP_API_URL;

function formatPaymentMethod(method) {
  const mapping = {
    cash: "Cash",
    bank_transfer: "Bank Transfer",
    credit_card: "Credit",
    debit_card: "Debit",
    mpesa: "Mpesa",
    check: "Check",
    wire_transfer: "Wire Transfer",
  };
  return mapping[method] || method;
}

const MarkAsPaidModal = ({ isOpen, onClose, payment, onPaymentUpdated }) => {
  const [formData, setFormData] = useState({
    amount: "",
    payment_method: "",
    payment_date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentMethods = [
    { value: "cash", label: "Cash" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "credit_card", label: "Credit Card" },
    { value: "debit_card", label: "Debit Card" },
    { value: "mpesa", label: "Mpesa" },
    { value: "check", label: "Check" },
    { value: "wire_transfer", label: "Wire Transfer" },
  ];

  useEffect(() => {
    if (isOpen && payment) {
      const today = new Date().toISOString().split("T")[0];
      setFormData({
        amount: payment.amount || "",
        payment_method: payment.payment_method || "",
        payment_date: today,
      });
    }
  }, [isOpen, payment]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.payment_method || !formData.payment_date) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    const confirmMessage = `Are you sure you want to mark this payment as paid?\n\nAmount: KES ${parseFloat(
      formData.amount
    ).toLocaleString()}\nMethod: ${formData.payment_method
      .replace("_", " ")
      .toUpperCase()}\nDate: ${formData.payment_date}`;

    if (!window.confirm(confirmMessage)) return;

    setIsSubmitting(true);

   try {
  const isoDate = new Date().toISOString();
  let response;

if (payment.isVirtual) {
  if (!payment.tenant_id || isNaN(payment.tenant_id)) {
    toast.error("Missing or invalid tenant ID. Cannot proceed.");
    console.error("❌ tenant_id issue:", payment.tenant_id, typeof payment.tenant_id);
    return;
  }

  const createData = {
    invoice_id: payment.invoice_id,
    tenant_id: payment.tenant_id,
    amount: parseFloat(formData.amount),
    status: "paid",
    payment_method: formData.payment_method,
    payment_date: formData.payment_date
      ? new Date(formData.payment_date).toISOString()
      : null,
    due_date: payment.due_date
      ? new Date(payment.due_date).toISOString().split("T")[0]
      : null,
  };

  console.log("✅ Sending createData to /payments/:", createData);
  response = await axios.post(`${API_URL}/payments/`, createData);
}

   else {
   const updateData = {
  amount: parseFloat(formData.amount),
  payment_method: formData.payment_method,
  payment_date: isoDate,  // not "date"
};


    response = await axios.put(
      `${API_URL}/payments/${payment.id}/mark-paid`,
      updateData
    );
  }

  toast.success(
    payment.isVirtual
      ? "Virtual payment recorded successfully."
      : "Payment marked as paid successfully."
  );

  if (onPaymentUpdated) {
    onPaymentUpdated(response.data);
  }

  onClose();
} catch (error) {
  console.error("Full error:", error);
  console.error("Error response:", error.response?.data);
  const msg =
    error.response?.data?.message ||
    JSON.stringify(error.response?.data?.detail) ||
    "Failed to update payment.";
  toast.error(msg);
} finally {
  setIsSubmitting(false); // <<< THIS IS MISSING — must be here
}


  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        amount: "",
        payment_method: "",
        payment_date: "",
      });
      onClose();
    }
  };

  if (!isOpen || !payment) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-container mark-as-paid-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-header-content">
            <h2 className="modal-title">
              <FiDollarSign className="modal-title-icon" />
              Mark Payment as Paid
            </h2>
            <div className="modal-subtitle">
              Invoice: <code>{payment.invoice_id}</code> | Tenant: {payment.tenant_name}
            </div>
          </div>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="mark-paid-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <FiDollarSign className="form-label-icon" />
                  Payment Amount *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="0.00"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FiCreditCard className="form-label-icon" />
                  Payment Method *
                </label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select payment method</option>
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FiCalendar className="form-label-icon" />
                  Payment Date *
                </label>
                <input
                  type="date"
                  name="payment_date"
                  value={formData.payment_date}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Mark as Paid"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAsPaidModal;
