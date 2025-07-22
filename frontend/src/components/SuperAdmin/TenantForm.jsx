import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import axios from "axios";
import "../../styles/SuperAdmin.css";
import { toast } from "react-toastify";

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
    serial_code: "",
    country: "",
    plan: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
        serial_code: initialData.serial_code || "",
        country: initialData.country || "",
        plan: initialData.plan || "",
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
        serial_code: "",
        country: "",
        plan: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Only regenerate slug if company_name is being typed
      if (name === "company_name") {
        updated.slug_url = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }

      return updated;
    });

    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.company_name.trim())
      newErrors.company_name = "Company name is required";
    if (!formData.contact_email.trim())
      newErrors.contact_email = "Contact email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.contact_email))
      newErrors.contact_email = "Invalid email format";
    if (!formData.slug_url.trim()) newErrors.slug_url = "Slug URL is required";
    if (!formData.contact_phone.trim())
      newErrors.contact_phone = "Contact phone is required";
    if (!formData.billing_address.trim())
      newErrors.billing_address = "Billing address is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.plan.trim()) newErrors.plan = "Plan is required";

    if (!formData.monthly_fee.toString().trim())
      newErrors.monthly_fee = "Monthly fee is required";
    else if (
      isNaN(formData.monthly_fee) ||
      parseFloat(formData.monthly_fee) < 0
    )
      newErrors.monthly_fee = "Invalid monthly fee";

    if (!formData.max_users.toString().trim())
      newErrors.max_users = "Max users is required";
    else if (isNaN(formData.max_users) || parseInt(formData.max_users) < 1)
      newErrors.max_users = "Max users must be at least 1";

    // Only validate if editing and serial_code is visible
    if (initialData?.id && !formData.serial_code.trim()) {
      newErrors.serial_code = "Serial code is required";
    } else if (
      initialData?.id &&
      !/^\d{6}$/.test(formData.serial_code.trim())
    ) {
      newErrors.serial_code = "Serial code must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      monthly_fee: parseFloat(formData.monthly_fee),
      max_users: parseInt(formData.max_users),
      plan: formData.plan, 
      country: formData.country,
    };

    if (initialData?.id) {
      payload.serial_code = formData.serial_code;
    }

   try {
  setSubmitting(true);
  let response;
  if (initialData?.id) {
    response = await axios.put(
      `${process.env.REACT_APP_API_URL}/tenants/tenants/${initialData.id}`,
      payload,
    );
    toast.success("Tenant updated successfully!", {
      position: "top-right",
      autoClose: 2000,
    });
  } else {
    response = await axios.post(
      `${process.env.REACT_APP_API_URL}/tenants/tenants/`,
      payload,
    );
    toast.success("Tenant created successfully!", {
      position: "top-right",
      autoClose: 2000,
    });
  }

  onSubmit(response.data);

  setTimeout(() => {
    setSuccessMessage("");
    onClose();
  }, 2000);

} catch (error) {
  console.error("Error submitting tenant:", error);
  const errorDetail = error.response?.data?.detail;

  if (errorDetail === "Email already in use.") {
    setErrors((prev) => ({ ...prev, contact_email: errorDetail }));
  } else if (errorDetail === "Company already exists.") {
    setErrors((prev) => ({ ...prev, company_name: errorDetail }));
  } else if (errorDetail === "Tenant with this slug already exists.") {
    setErrors((prev) => ({ ...prev, slug_url: errorDetail }));
  } else if (errorDetail === "Serial code already in use.") {
    setErrors((prev) => ({ ...prev, serial_code: errorDetail }));
  }

  toast.error(
    errorDetail || "An error occurred. Please try again.",
    {
      position: "top-right",
      autoClose: 3000,
    }
  );
} finally {
  setSubmitting(false);
}}


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
              />
              {errors.company_name && (
                <span className="error-text">{errors.company_name}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Contact Email *</label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                className={`form-input ${errors.contact_email ? "error" : ""}`}
              />
              {errors.contact_email && (
                <span className="error-text">{errors.contact_email}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Slug URL *</label>
              <input
                type="text"
                name="slug_url"
                value={formData.slug_url}
                onChange={handleChange}
                className={`form-input ${errors.slug_url ? "error" : ""}`}
              />
              {errors.slug_url && (
                <span className="error-text">{errors.slug_url}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone *</label>
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                className={`form-input ${errors.contact_phone ? "error" : ""}`}
              />
              {errors.contact_phone && (
                <span className="error-text">{errors.contact_phone}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Country *</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`form-input ${errors.country ? "error" : ""}`}
              >
                <option value="">Select Country</option>
                <option value="Kenya">Kenya</option>
                <option value="Uganda">Uganda</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Burundi">Burundi</option>
                <option value="South Sudan">South Sudan</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Somalia">Somalia</option>
                <option value="Djibouti">Djibouti</option>
                <option value="Eritrea">Eritrea</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="South Africa">South Africa</option>
                <option value="Egypt">Egypt</option>
                <option value="Morocco">Morocco</option>
                <option value="Algeria">Algeria</option>
                <option value="Tunisia">Tunisia</option>
                <option value="Libya">Libya</option>
                <option value="Sudan">Sudan</option>
                <option value="Chad">Chad</option>
                <option value="Central African Republic">
                  Central African Republic
                </option>
                <option value="Cameroon">Cameroon</option>
                <option value="Equatorial Guinea">Equatorial Guinea</option>
                <option value="Gabon">Gabon</option>
                <option value="Republic of the Congo">
                  Republic of the Congo
                </option>
                <option value="Democratic Republic of the Congo">
                  Democratic Republic of the Congo
                </option>
                <option value="Angola">Angola</option>
                <option value="Zambia">Zambia</option>
                <option value="Zimbabwe">Zimbabwe</option>
                <option value="Botswana">Botswana</option>
                <option value="Namibia">Namibia</option>
                <option value="Lesotho">Lesotho</option>
                <option value="Eswatini">Eswatini</option>
                <option value="Malawi">Malawi</option>
                <option value="Mozambique">Mozambique</option>
                <option value="Madagascar">Madagascar</option>
                <option value="Mauritius">Mauritius</option>
                <option value="Seychelles">Seychelles</option>
                <option value="Comoros">Comoros</option>
                <option value="Cape Verde">Cape Verde</option>
                <option value="São Tomé and Príncipe">
                  São Tomé and Príncipe
                </option>
                <option value="Guinea-Bissau">Guinea-Bissau</option>
                <option value="Guinea">Guinea</option>
                <option value="Sierra Leone">Sierra Leone</option>
                <option value="Liberia">Liberia</option>
                <option value="Ivory Coast">Ivory Coast</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Mali">Mali</option>
                <option value="Niger">Niger</option>
                <option value="Senegal">Senegal</option>
                <option value="Mauritania">Mauritania</option>
                <option value="Gambia">Gambia</option>
                <option value="Togo">Togo</option>
                <option value="Benin">Benin</option>
              </select>
              {errors.country && (
                <span className="error-text">{errors.country}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Plan *</label>
              <select
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className={`form-input ${errors.plan ? "error" : ""}`}
              >
                <option value="">Select Plan</option>
                <option value="Basic">Basic Plan</option>
                <option value="Standard">Standard Plan</option>
                <option value="Premium">Premium Plan</option>
                <option value="Enterprise">Enterprise Plan</option>
                <option value="Custom">Custom Plan</option>
              </select>
              {errors.plan && <span className="error-text">{errors.plan}</span>}
            </div>

            <div className="form-group form-group-full">
              <label className="form-label">Billing Address *</label>
              <textarea
                name="billing_address"
                value={formData.billing_address}
                onChange={handleChange}
                className={`form-textarea ${errors.billing_address ? "error" : ""}`}
              />
              {errors.billing_address && (
                <span className="error-text">{errors.billing_address}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Fee (KES) *</label>
              <input
                type="number"
                name="monthly_fee"
                value={formData.monthly_fee}
                onChange={handleChange}
                className={`form-input ${errors.monthly_fee ? "error" : ""}`}
              />
              {errors.monthly_fee && (
                <span className="error-text">{errors.monthly_fee}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Max Users *</label>
              <input
                type="number"
                name="max_users"
                value={formData.max_users}
                onChange={handleChange}
                className={`form-input ${errors.max_users ? "error" : ""}`}
              />
              {errors.max_users && (
                <span className="error-text">{errors.max_users}</span>
              )}
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
              {errors.status && (
                <span className="error-text">{errors.status}</span>
              )}
            </div>

            {initialData?.id && (
              <div className="form-group">
                <label className="form-label">Serial Code *</label>
                <input
                  type="text"
                  name="serial_code"
                  value={formData.serial_code}
                  onChange={handleChange}
                  className={`form-input ${errors.serial_code ? "error" : ""}`}
                  placeholder="e.g. 000001"
                  pattern="\d{6}"
                  title="Serial code must be 6 digits"
                />
                {errors.serial_code && (
                  <span className="error-text">{errors.serial_code}</span>
                )}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : initialData
                  ? "Update Tenant"
                  : "Add Tenant"}
            </button>
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantForm;
