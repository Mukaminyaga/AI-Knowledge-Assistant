import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import axios from "axios";
import "../../styles/SuperAdmin.css";

const TenantForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    company_name: "",
    contact_email: "",
    slug_url: "",
    contact_phone: "",
    billing_address: "",
    monthly_fee: "",
    max_users: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // 👇 Sync formData with initialData
  useEffect(() => {
    if (initialData) {
      setFormData({
        company_name: initialData.company_name || "",
        contact_email: initialData.contact_email || "",
        slug_url: initialData.slug_url || "",
        contact_phone: initialData.contact_phone || "",
        billing_address: initialData.billing_address || "",
        monthly_fee: initialData.monthly_fee || "",
        max_users: initialData.max_users || "",
        status: initialData.status || "active",
      });
    } else {
      setFormData({
        company_name: "",
        contact_email: "",
        slug_url: "",
        contact_phone: "",
        billing_address: "",
        monthly_fee: "",
        max_users: "",
        status: "active",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "company_name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({
        ...prev,
        slug_url: slug,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.company_name.trim()) newErrors.company_name = "Company name is required";
    if (!formData.contact_email.trim()) newErrors.contact_email = "Contact email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.contact_email)) newErrors.contact_email = "Invalid email format";
    if (!formData.slug_url.trim()) newErrors.slug_url = "Slug URL is required";
    if (!formData.contact_phone.trim()) newErrors.contact_phone = "Contact phone is required";
    if (!formData.billing_address.trim()) newErrors.billing_address = "Billing address is required";

    if (!formData.monthly_fee.toString().trim()) newErrors.monthly_fee = "Monthly fee is required";
    else if (isNaN(formData.monthly_fee) || parseFloat(formData.monthly_fee) < 0)
      newErrors.monthly_fee = "Invalid monthly fee";

    if (!formData.max_users.toString().trim()) newErrors.max_users = "Max users is required";
    else if (isNaN(formData.max_users) || parseInt(formData.max_users) < 1)
      newErrors.max_users = "Max users must be at least 1";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      monthly_fee: parseFloat(formData.monthly_fee),
      max_users: parseInt(formData.max_users),
      status: formData.status || "active",
    };

    try {
      setSubmitting(true);
      let response;

      if (initialData?.id) {
        response = await axios.put(
          `${process.env.REACT_APP_API_URL}/tenants/tenants/${initialData.id}/`,
          payload
        );
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_API_URL}/tenants/tenants/`,
          payload
        );
      }

      onSubmit(response.data);
      onClose();
    } catch (error) {
      console.error("Error submitting tenant:", error);
      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert("An error occurred. Please try again.");
      }
    } finally {
      setSubmitting(false);
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
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className={`form-input ${errors.company_name ? "error" : ""}`}
                placeholder="Enter company name"
              />
              {errors.company_name && <span className="error-text">{errors.company_name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Contact Email *</label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                className={`form-input ${errors.contact_email ? "error" : ""}`}
                placeholder="contact@company.com"
              />
              {errors.contact_email && <span className="error-text">{errors.contact_email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Slug URL *</label>
              <input
                type="text"
                name="slug_url"
                value={formData.slug_url}
                onChange={handleChange}
                className={`form-input ${errors.slug_url ? "error" : ""}`}
                placeholder="company-slug"
              />
              {errors.slug_url && <span className="error-text">{errors.slug_url}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone *</label>
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                className={`form-input ${errors.contact_phone ? "error" : ""}`}
                placeholder="+254 712 345678"
              />
              {errors.contact_phone && <span className="error-text">{errors.contact_phone}</span>}
            </div>

            <div className="form-group form-group-full">
              <label className="form-label">Billing Address *</label>
              <textarea
                name="billing_address"
                value={formData.billing_address}
                onChange={handleChange}
                className={`form-textarea ${errors.billing_address ? "error" : ""}`}
                placeholder="Enter full billing address"
                rows="3"
              />
              {errors.billing_address && <span className="error-text">{errors.billing_address}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Fee (KES) *</label>
              <input
                type="number"
                name="monthly_fee"
                value={formData.monthly_fee}
                onChange={handleChange}
                className={`form-input ${errors.monthly_fee ? "error" : ""}`}
                placeholder="1200"
                min="0"
                step="0.01"
              />
              {errors.monthly_fee && <span className="error-text">{errors.monthly_fee}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Max Users *</label>
              <input
                type="number"
                name="max_users"
                value={formData.max_users}
                onChange={handleChange}
                className={`form-input ${errors.max_users ? "error" : ""}`}
                placeholder="10"
                min="1"
              />
              {errors.max_users && <span className="error-text">{errors.max_users}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`form-input ${errors.status ? "error" : ""}`}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              {errors.status && <span className="error-text">{errors.status}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Submitting..." : initialData ? "Update Tenant" : "Add Tenant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantForm;
