import React from "react";
import { Link } from "react-router-dom";
import "../styles/Terms.css";

const TermsOfService = () => {
  return (
    <div className="terms-page">
      <div className="terms-container">
        <div className="terms-header">
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

        <div className="terms-card">
          <h1 className="terms-title">Terms and Conditions</h1>
          <p className="terms-subtitle">Last updated: July 2025</p>

          <div className="terms-content">
            <section className="terms-section">
              <h2 className="section-title">1. Acceptance of Terms</h2>
              <div className="section-content">
                By accessing and using our AI Knowledge Assistant platform, you
                agree to comply with and be bound by these Terms and Conditions.
                If you do not agree with any part of these terms, please do not
                use our services. Your continued use of the platform constitutes
                acceptance of these terms.
              </div>
            </section>

            <section className="terms-section">
              <h2 className="section-title">2. User Eligibility</h2>
              <div className="section-content">
                You must be at least 18 years of age and legally capable of
                entering into binding agreements. Use of the platform by anyone
                under 18 is strictly prohibited. By using our services, you
                represent and warrant that you meet these age requirements.
              </div>
            </section>

            <section className="terms-section">
              <h2 className="section-title">3. Account Responsibility</h2>
              <div className="section-content">
                Users are responsible for maintaining the confidentiality of
                their login credentials and all activities that occur under
                their account. You agree to:
                <ul>
                  <li>
                    Provide accurate and complete information during
                    registration
                  </li>
                  <li>Maintain the security of your password and account</li>
                  <li>
                    Notify us immediately of any unauthorized use of your
                    account
                  </li>
                  <li>
                    Accept responsibility for all activities under your account
                  </li>
                </ul>
              </div>
            </section>

            <section className="terms-section">
              <h2 className="section-title">4. Acceptable Use</h2>
              <div className="section-content">
                You agree not to use the platform for any unlawful, harmful, or
                abusive purpose. Prohibited activities include but are not
                limited to:
                <ul>
                  <li>Violating any applicable laws or regulations</li>
                  <li>
                    Transmitting harmful, threatening, or inappropriate content
                  </li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>
                    Interfering with the proper functioning of the platform
                  </li>
                </ul>
                Misuse of the platform may lead to account suspension or
                termination.
              </div>
            </section>

            <section className="terms-section">
              <h2 className="section-title">5. Intellectual Property</h2>
              <div className="section-content">
                All content on the platform, including but not limited to code,
                text, graphics, logos, and software, are the intellectual
                property of AI Knowledge Assistant and are protected by
                copyright and other intellectual property laws. You may not
                reproduce, distribute, or create derivative works without our
                express written permission.
              </div>
            </section>

            <section className="terms-section">
              <h2 className="section-title">6. Data and Privacy</h2>
              <div className="section-content">
                Your privacy is important to us. Our collection and use of
                personal information is governed by our Privacy Policy. By using
                our services, you consent to the collection and use of your
                information as described in our Privacy Policy.
              </div>
            </section>

            <section className="terms-section">
              <h2 className="section-title">7. Limitation of Liability</h2>
              <div className="section-content">
                We are not liable for any direct, indirect, incidental, special,
                or consequential damages resulting from your use of the
                platform. All services are provided "as-is" without any
                warranties, express or implied. Our total liability shall not
                exceed the amount paid by you for the services.
              </div>
            </section>

            <section className="terms-section">
              <h2 className="section-title">8. Modifications</h2>
              <div className="section-content">
                We may revise these Terms at any time by posting updated terms
                on our platform. Continued use of the platform after such
                changes constitutes your acceptance of the new Terms. We
                recommend reviewing these terms periodically for any updates.
              </div>
            </section>

            <section className="terms-section">
              <h2 className="section-title">9. Contact Information</h2>
              <div className="section-content">
                <div className="contact-info">
                  If you have any questions about these Terms and Conditions,
                  please contact us at:
                  <br />
                  <br />
               <a
  href="mailto:knowledgeassistantai@gmail.com"
  className="contact-email text-blue-600 hover:underline"
>
  knowledgeassistantai@gmail.com
</a>

                </div>
              </div>
            </section>
          </div>

          <div className="terms-footer">
            <p className="footer-text">
              By using our service, you acknowledge that you have read and
              understood these terms.
            </p>
            <div className="footer-actions">
              <Link to="/signup" className="footer-link">
                Return to Sign Up
              </Link>
              <Link to="/privacy" className="footer-link">
                Privacy Policy
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

export default TermsOfService;
