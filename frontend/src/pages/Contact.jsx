import React, { useState } from "react";
import Header from "../components/Header";
import "../styles/Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="contact-container">
      <Header />
      <div className="contact-content">
        <div className="contact-grid">
          <div className="contact-left-column">
            <div className="contact-hero">
              <div className="contact-title">
                Get in Touch
                <br />
                with Our Team
              </div>
              <div className="contact-description">
                Have questions about our AI Knowledge Assistant? <br />
                We're here to help you find the perfect solution <br />
                for your team's needs.
              </div>
              <div className="contact-info">
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div className="contact-text">
                    <div className="contact-label">Email Us</div>
                    <div className="contact-value">info@goodpartnerske.org</div>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div className="contact-text">
                    <div className="contact-label">Call Us</div>
                    <div className="contact-value">+254 711 085 400</div>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">🏢</div>
                  <div className="contact-text">
                    <div className="contact-label">Visit Us</div>
                    <div className="contact-value">
                      Marsabit Plaza, Ngong Road
                    </div>
                  </div>
                </div>
                {/* <div className="contact-item">
                  <div className="contact-icon">⏰</div>
                  <div className="contact-text">
                    <div className="contact-label">Support Hours</div>
                    <div className="contact-value">
                      Monday - Friday: 9AM - 5PM EST
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="contact-right-column">
            <div className="contact-form-container">
              <div className="contact-form-wrapper">
                <div className="contact-form-title">Send us a Message</div>
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Full Name *
                    </label>
                    <input
                      type="text"
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
                    <label htmlFor="email" className="form-label">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      placeholder="your.email@company.com"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">
                      Subject *
                    </label>
                    <input
                      type="text"
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
                    <label htmlFor="message" className="form-label">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="form-textarea"
                      required
                      placeholder="Tell us more about your needs and how we can help..."
                      rows="5"
                    ></textarea>
                  </div>
                  <button type="submit" className="submit-button">
                    Send Message
                  </button>
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
