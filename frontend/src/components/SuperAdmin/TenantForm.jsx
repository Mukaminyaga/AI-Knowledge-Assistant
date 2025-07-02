import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import "../../styles/SuperAdmin.css";

const TenantForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      companyName: "",
      contactEmail: "",
      slugUrl: "",
      contactPhone: "",
      billingAddress: "",
      plan: "starter",
      monthlyFee: "",
      maxUsers: "",
    },
  );

  const [errors, setErrors] = useState({});

  const plans = [
    { value: "starter", label: "Starter Plan", fee: 29 },
    { value: "professional", label: "Professional Plan", fee: 99 },
    { value: "enterprise", label: "Enterprise Plan", fee: 4500 },
    { value: "custom", label: "Custom Plan", fee: null },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-populate monthly fee based on plan selection
    if (name === "plan") {
      const selectedPlan = plans.find((plan) => plan.value === value);
      if (selectedPlan && selectedPlan.fee) {
        setFormData((prev) => ({
          ...prev,
          monthlyFee: selectedPlan.fee.toString(),
        }));
      }
    }

    // Auto-generate slug from company name
    if (name === "companyName") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({
        ...prev,
        slugUrl: slug,
      }));
    }

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Invalid email format";
    }

    if (!formData.slugUrl.trim()) {
      newErrors.slugUrl = "Slug URL is required";
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = "Contact phone is required";
    }

    if (!formData.billingAddress.trim()) {
      newErrors.billingAddress = "Billing address is required";
    }

    if (!formData.monthlyFee.trim()) {
      newErrors.monthlyFee = "Monthly fee is required";
    } else if (
      isNaN(formData.monthlyFee) ||
      parseFloat(formData.monthlyFee) < 0
    ) {
      newErrors.monthlyFee = "Invalid monthly fee";
    }

    if (!formData.maxUsers.trim()) {
      newErrors.maxUsers = "Max users is required";
    } else if (isNaN(formData.maxUsers) || parseInt(formData.maxUsers) < 1) {
      newErrors.maxUsers = "Max users must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        ...formData,
        monthlyFee: parseFloat(formData.monthlyFee),
        maxUsers: parseInt(formData.maxUsers),
        id: initialData?.id || Date.now(),
        createdAt: initialData?.createdAt || new Date().toISOString(),
        status: initialData?.status || "active",
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            {initialData ? "Edit Tenant" : "Add New Tenant"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="tenant-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={`form-input ${errors.companyName ? "error" : ""}`}
                placeholder="Enter company name"
              />
              {errors.companyName && (
                <span className="error-text">{errors.companyName}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Contact Email *</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className={`form-input ${errors.contactEmail ? "error" : ""}`}
                placeholder="contact@company.com"
              />
              {errors.contactEmail && (
                <span className="error-text">{errors.contactEmail}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Slug URL *</label>
              <input
                type="text"
                name="slugUrl"
                value={formData.slugUrl}
                onChange={handleChange}
                className={`form-input ${errors.slugUrl ? "error" : ""}`}
                placeholder="company-slug"
              />
              {errors.slugUrl && (
                <span className="error-text">{errors.slugUrl}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone *</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className={`form-input ${errors.contactPhone ? "error" : ""}`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.contactPhone && (
                <span className="error-text">{errors.contactPhone}</span>
              )}
            </div>

            <div className="form-group form-group-full">
              <label className="form-label">Billing Address *</label>
              <textarea
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleChange}
                className={`form-textarea ${errors.billingAddress ? "error" : ""}`}
                placeholder="Enter full billing address"
                rows="3"
              />
              {errors.billingAddress && (
                <span className="error-text">{errors.billingAddress}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Plan *</label>
              <select
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="form-input"
              >
                {plans.map((plan) => (
                  <option key={plan.value} value={plan.value}>
                    {plan.label} {plan.fee ? `($${plan.fee}/month)` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Fee ($) *</label>
              <input
                type="number"
                name="monthlyFee"
                value={formData.monthlyFee}
                onChange={handleChange}
                className={`form-input ${errors.monthlyFee ? "error" : ""}`}
                placeholder="29.00"
                min="0"
                step="0.01"
              />
              {errors.monthlyFee && (
                <span className="error-text">{errors.monthlyFee}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Max Users *</label>
              <input
                type="number"
                name="maxUsers"
                value={formData.maxUsers}
                onChange={handleChange}
                className={`form-input ${errors.maxUsers ? "error" : ""}`}
                placeholder="10"
                min="1"
              />
              {errors.maxUsers && (
                <span className="error-text">{errors.maxUsers}</span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? "Update Tenant" : "Add Tenant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantForm;
