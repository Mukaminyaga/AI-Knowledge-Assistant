import React, { useState } from "react";
import LandingHeader from "../components/Landing/LandingHeader";
import LandingFooter from "../components/Landing/LandingFooter";
import "../styles/Contact.css";
import axios from "axios";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ success: null, message: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/contact/send-email`, formData);
      if (res.data.success) {
        setStatus({ success: true, message: "Thank you for your message! We'll get back to you soon." });
        setFormData({ name: "", email: "", contact: "", subject: "", message: "" });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setStatus({ success: false, message: res.data.error || "Something went wrong. Try again later." });
      }
    } catch (error) {
      setStatus({ success: false, message: error.message || "An error occurred while sending your message." });
    }
  };

  return (
    <div className="contact-page">
      <LandingHeader />
      
      <div className="contact-main-content">
        <div className="contact-container">
          {/* Contact Form Section */}
          <div className="contact-form-section">
            <div className="contact-form-card">
              <h2 className="contact-form-title">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-field">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-field">
                  <label htmlFor="contact" className="form-label">Contact</label>
                  <input
                    id="contact"
                    name="contact"
                    type="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

              <div className="form-field">
  <label htmlFor="subject" className="form-label">Subject</label>
  <div className="select-wrapper">
    <select
      id="subject"
      name="subject"
      value={formData.subject}
      onChange={handleInputChange}
      className="form-input select-input"
      required
    >
<option value="General Inquiry">General Inquiry</option>
<option value="Customer Support">Customer Support</option>
<option value="Feedback">Feedback</option>
<option value="Partnership">Partnership</option>
<option value="Other">Other</option>

    </select>

    <svg
      className="select-icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* <path
        d="M19.9181 8.94995L13.3981 15.47C12.6281 16.24 11.3681 16.24 10.5981 15.47L4.07812 8.94995"
        stroke="#585857"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      /> */}
    </svg>
  </div>
</div>


                <div className="form-field">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="form-textarea"
                    required
                    rows="8"
                  />
                </div>

                <button type="submit" className="submit-button">
                  Send Message
                </button>

                {status.message && (
                  <div className={`status-message ${status.success ? "success" : "error"}`}>
                    {status.message}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="contact-info-section">
            <div className="contact-info-content">
              <h2 className="contact-info-title">Get in Touch</h2>
              <p className="contact-info-description">
                We're here to answer your questions and discuss how our solutions can address your needs. Reach out to us through any of the channels below.
              </p>
            </div>

            <div className="contact-details">
              <h3 className="contact-details-title">Contact Information</h3>
              
              <div className="contact-detail-item">
                <svg className="contact-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_233_1946)">
                    <path d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z" fill="#080808"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_233_1946">
                      <rect width="24" height="24" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <span className="contact-detail-text">vala.ai@vala.ke</span>
              </div>

              <div className="contact-detail-item">
                <svg className="contact-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_233_1950)">
                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#080808"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_233_1950">
                      <rect width="24" height="24" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <span className="contact-detail-text">+254 711 085 400</span>
              </div>

              <div className="contact-detail-item">
                <svg className="contact-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_233_1954)">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#080808"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_233_1954">
                      <rect width="24" height="24" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <span className="contact-detail-text">Marsabit Plaza, Ngong Road, Nairobi, Kenya</span>
              </div>
            </div>

            <div className="office-hours">
              <h3 className="office-hours-title">Office Hours</h3>
              <p className="office-hours-text">
                Monday to Friday: 8:30 AM - 5:00 PM<br />
                Saturday & Sunday: Closed
              </p>
            </div>

            <div className="connect-section">
              <h3 className="connect-title">Connect With Us</h3>
              <a href="#" className="linkedin-link">LinkedIn</a>
            </div>
          </div>
        </div>

        {/* Google Maps Section */}
        {/* <div className="maps-section">
          <div className="maps-placeholder">
            <span className="maps-text">Google Maps Embed Would Go Here</span>
          </div>
        </div> */}
      </div>

      <LandingFooter />
    </div>
  );
}

export default Contact;
