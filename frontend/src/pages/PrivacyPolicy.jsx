import React from "react";
import { Link } from "react-router-dom";
import "../styles/PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <div className="privacy-header">
          <Link to="/signup" className="back-navigation">
            <svg
              className="back-arrow"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Sign Up
          </Link>
        </div>

        <div className="privacy-card">
          <h1 className="privacy-title">Privacy Policy</h1>
          <p className="privacy-subtitle">
            This Privacy Policy explains how we collect, use, and protect your
            information when using our AI Knowledge Assistant platform.
          </p>

          <div className="privacy-summary">
            <h3 className="summary-title">At a Glance</h3>
            <p className="summary-text">
              We are committed to protecting your privacy and ensuring
              transparency about how we handle your data. We collect only the
              information necessary to provide our services and never sell your
              personal data to third parties.
            </p>
          </div>

          <div className="privacy-content">
            <section className="privacy-section">
              <h2 className="section-title">1. Information We Collect</h2>
              <div className="section-content">
                We collect information to provide and improve our services:
                <ul>
                  <li>
                    <strong>Personal Information:</strong> First name, last
                    name, email address, password (encrypted), job title, and
                    company serial code for account creation and authentication.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> IP address, browser type,
                    device information, session duration, and activity logs to
                    improve our services and ensure security.
                  </li>
                  <li>
                    <strong>Document Data:</strong> Content you upload to our
                    platform for processing by our AI assistant, stored securely
                    and processed only for providing our services.
                  </li>
                  <li>
                    <strong>Cookies and Tracking:</strong> We use essential
                    cookies for authentication and optional analytics cookies to
                    understand how you use our platform.
                  </li>
                </ul>
              </div>
            </section>

            <section className="privacy-section">
              <h2 className="section-title">2. How We Use Your Information</h2>
              <div className="section-content">
                Your information is used exclusively to provide and enhance our
                services:
                <ul>
                  <li>
                    Deliver and maintain the AI Knowledge Assistant Service
                  </li>
                  <li>
                    Authenticate your account and ensure platform security
                  </li>
                  <li>
                    Process and analyze documents you upload for AI responses
                  </li>
                  <li>
                    Notify you of important updates, security alerts, or
                    announcements
                  </li>
                  <li>
                    Improve our features and AI models based on anonymized usage
                    patterns
                  </li>
                  <li>
                    Prevent fraud, abuse, and ensure compliance with our terms
                  </li>
                  <li>
                    Provide customer support and respond to your inquiries
                  </li>
                </ul>
              </div>
            </section>

            <section className="privacy-section">
              <h2 className="section-title">
                3. Information Sharing and Disclosure
              </h2>
              <div className="section-content">
                <div className="highlight-box">
                  We do not sell, rent, or trade your personal data to any third
                  parties.
                </div>
                Your data may be shared only in the following limited
                circumstances:
                <ul>
                  <li>
                    <strong>Service Providers:</strong> With vetted third-party
                    service providers who assist in operating our platform, all
                    under strict confidentiality agreements (NDAs)
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required to comply
                    with applicable laws, legal processes, or government
                    requests
                  </li>
                  <li>
                    <strong>Security:</strong> To protect the rights, property,
                    or safety of our users, our platform, or the public
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with any
                    merger, acquisition, or asset sale, with advance notice to
                    users
                  </li>
                </ul>
              </div>
            </section>

            <section className="privacy-section">
              <h2 className="section-title">4. Data Security and Protection</h2>
              <div className="section-content">
                We implement industry-standard security measures to protect your
                data:
                <ul>
                  <li>
                    <strong>Encryption:</strong> All data is encrypted in
                    transit using TLS and at rest using AES-256 encryption
                  </li>
                  <li>
                    <strong>Access Controls:</strong> Strict access controls
                    ensure only authorized personnel can access your data
                  </li>
                  <li>
                    <strong>Regular Audits:</strong> We conduct regular security
                    audits and penetration testing
                  </li>
                  {/* <li>
                    <strong>Data Centers:</strong> Our data is stored in SOC 2
                    Type II certified data centers
                  </li> */}
                  <li>
                    <strong>Incident Response:</strong> We have comprehensive
                    incident response procedures for any security events
                  </li>
                </ul>
              </div>
            </section>

            <section className="privacy-section">
              <h2 className="section-title">5. Your Rights and Choices</h2>
              <div className="section-content">
                You have several rights regarding your personal information:
                <ul>
                  <li>
                    <strong>Access:</strong> Request a copy of the personal
                    information we hold about you
                  </li>
                  <li>
                    <strong>Correction:</strong> Update or correct any
                    inaccurate personal information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your personal
                    data (subject to legal obligations)
                  </li>
                  <li>
                    <strong>Portability:</strong> Request a copy of your data in
                    a portable format
                  </li>
                  <li>
                    <strong>Objection:</strong> Object to certain processing of
                    your personal information
                  </li>
                  <li>
                    <strong>Marketing:</strong> Unsubscribe from marketing
                    emails at any time
                  </li>
                </ul>
                To exercise these rights, please contact us at the email address
                provided below.
              </div>
            </section>

            <section className="privacy-section">
              <h2 className="section-title">6. Data Retention</h2>
              <div className="section-content">
                We retain your personal information only as long as necessary to
                provide our services and comply with legal obligations.
                Specifically:
                <ul>
                  <li>
                    Account information is retained while your account is active
                  </li>
                  <li>
                    Document data is retained according to your organization's
                    settings
                  </li>
                  <li>
                    Usage logs are retained for up to 24 months for security and
                    analytics
                  </li>
                  <li>Deleted data is permanently removed within 30 days</li>
                </ul>
              </div>
            </section>

            <section className="privacy-section">
              <h2 className="section-title">7. Children's Privacy</h2>
              <div className="section-content">
                Our services are not designed for or directed at individuals
                under the age of 18. We do not knowingly collect personal
                information from children under 18. If we become aware that we
                have collected such information, we will take steps to delete it
                promptly.
              </div>
            </section>

            <section className="privacy-section">
              <h2 className="section-title">8. International Data Transfers</h2>
              <div className="section-content">
                Your information may be transferred to and processed in
                countries other than your own. We ensure that any international
                transfers comply with applicable data protection laws and
                implement appropriate safeguards to protect your information.
              </div>
            </section>

            <section className="privacy-section">
              <h2 className="section-title">9. Changes to This Policy</h2>
              <div className="section-content">
                We may occasionally update this Privacy Policy to reflect
                changes in our practices or legal requirements. When we make
                material changes, we will:
                <ul>
                  <li>
                    Update the "Last updated" date at the top of this policy
                  </li>
                  <li>Notify users via email for significant changes</li>
                  <li>Provide prominent notice on our platform</li>
                  <li>Allow time for review before changes take effect</li>
                </ul>
              </div>
            </section>

            <section className="privacy-section">
              <h2 className="section-title">10. Contact Us</h2>
              <div className="section-content">
                <div className="contact-info">
                  If you have any questions about this Privacy Policy or our
                  data practices, please don't hesitate to contact us:
                  <br />
                  <br />
                  <strong>Email:</strong>{" "}
   <a
  href="mailto:vala.ai@goodpartnerske.org"
  className="contact-email text-blue-600 hover:underline"
>
  vala.ai@goodpartnerske.org
</a>
                  <br />
                  <strong>General Support:</strong>{" "}
                                                <a
  href="mailto:info@goodpartnerske.org"
  className="contact-email text-blue-600 hover:underline"
>
 info@goodpartnerske.org
</a>
                  <br />
                  <br />
                  We will respond to your inquiry within 48 hours.
                </div>
              </div>
            </section>
          </div>

          <div className="privacy-footer">
            <p className="last-updated">Last updated: July 2025</p>
            <div className="footer-actions">
              <Link to="/signup" className="footer-link">
                Return to Sign Up
              </Link>
              <Link to="/terms" className="footer-link">
                Terms of Service
              </Link>
              <Link to="/" className="footer-link">
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
