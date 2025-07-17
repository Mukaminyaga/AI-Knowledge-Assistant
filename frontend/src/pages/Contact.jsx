import React, { useState } from "react";
import Header from "../components/Header";
import "../styles/Contact.css";
import axios from "axios";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";


function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ success: null, message: "" }); // status state

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
      setFormData({ name: "", email: "", subject: "", message: "" }); // reset
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
    <div className="contact-container">
      <Header />
      <div className="contact-content">
        <div className="contact-grid">
          
          <div className="contact-left-column ">
  <div className="contact-hero">
    <div className="contact-title">
      Get in Touch<br />with Our Team
    </div>

    <div className="contact-description">
      Have questions about our AI Knowledge Assistant? <br />
      We're here to help you find the perfect solution <br />
      for your team's needs.
    </div>

    <div className="contact-info">
      <div className="contact-item">
        <div className="contact-icon text-blue-600">
          <MdEmail size={24} />
        </div>
        <div className="contact-text">
          <div className="contact-label">Email Us</div>
          <div className="contact-value">vala.ai@goodpartnerske.org</div>
        </div>
      </div>

      <div className="contact-item">
        <div className="contact-icon text-green-600">
          <MdPhone size={24} />
        </div>
        <div className="contact-text">
          <div className="contact-label">Call Us</div>
          <div className="contact-value">+254 711 085 400</div>
        </div>
      </div>

      <div className="contact-item">
        <div className="contact-icon text-red-600">
          <MdLocationOn size={24} />
        </div>
        <div className="contact-text">
          <div className="contact-label">Visit Us</div>
          <div className="contact-value">Marsabit Plaza, Ngong Road</div>
        </div>
      </div>
    </div>
  </div>
</div>

          
          <div className="contact-right-column">
            <div className="contact-form-container">
              <div className="contact-form-wrapper">
                <div className="contact-form-title">Send us a Message</div>
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name *</label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address *</label>
                    <input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      placeholder="you@example.com"
                      type="email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">Subject *</label>
                    <input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      placeholder="What's this about?"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="form-textarea"
                      required
                      placeholder="Tell us more about your needs..."
                      rows="5"
                    />
                  </div>
                  <button type="submit" className="submit-button">Send Message</button>

                  {status.message && (
                    <div className={`status-message ${status.success ? "success" : "error"}`} style={{marginTop: "1rem"}}>
                      {status.message}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
          
        </div>
      </div> 
    </div>
  );
}

export default Contact;
