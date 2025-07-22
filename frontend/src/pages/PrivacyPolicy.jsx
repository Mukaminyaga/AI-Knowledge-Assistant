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
          <h1 className="privacy-title">Vala.ai Privacy Policy Statement</h1>
           <p className="privacy-subtitle">Last updated: July 2025</p>
          <p className="privacy-subtitle">
            This Privacy Policy outlines how we collect, use, and protect your personal information when
            you use Vala.ai, the AI Knowledge Assistant platform by Good Partners Limited.
          </p>

          <div className="privacy-summary">
            <h3 className="summary-title">At a Glance</h3>
            <p className="summary-text">
             At Good Partners, we are committed to protecting your privacy and being transparent about
             how we handle your data. We only collect the information necessary to deliver and improve
             our services, and we do not sell your personal information to third parties.
            </p>
          </div>

          <div className="privacy-content">
            <section className="privacy-section">
              <h2 className="section-title">1. Information We Collect</h2>
              <div className="section-content">
                We collect the following types of information to support your experience on Vala.ai:
                <ul>
                  <li>
                    <strong>Personal Information:</strong> Name, email address, encrypted password, job title, and
                    organization code—for account creation and secure access.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> IP address, browser type, device information, session duration, and
                   activity logs—for platform optimization and security.
                  </li>
                  <li>
                    <strong>Document Data:</strong> Content you upload to Vala.ai for processing—stored securely and
used exclusively to deliver AI responses.
                  </li>
                  <li>
                    <strong>Cookies and Tracking:</strong> Essential cookies are used for authentication; optional
cookies help us understand how you interact with Vala.ai.
                  </li>
                </ul>
              </div>
            </section>

            <section className="privacy-section">
              <h2 className="section-title">2. How We Use Your Information</h2>
              <div className="section-content">
                Your information is used to:
                <ul>
                  <li>
                    Deliver, operate, and improve Vala.ai
                  </li>
                  <li>
                    Authenticate user accounts and maintain security
                  </li>
                  <li>
                    Process uploaded content to generate intelligent AI responses
                  </li>
                  <li>
                    Communicate important service notifications and platform updates
                  </li>
                  <li>
                   Improve features and performance based on anonymized usage
                  </li>
                  <li>
                    Detect and prevent misuse, fraud, or policy violations
                  </li>
                  <li>
                    Provide customer support and technical assistance
                  </li>
                </ul>
              </div>
            </section>
              <section className="privacy-section">
              <h2 className="section-title">
                3. AI Processing and Learning
              </h2>
              <div className="section-content">
                {/* <div className="highlight-box"> */}
                  Vala.ai processes your content to generate intelligent responses using advanced AI models.
Unless you have opted in, your data is not used to train or improve our underlying models.

When feedback is used to enhance system performance, it is fully anonymized and aggregated.
We may also integrate third-party AI services under strict confidentiality and data protection
agreements.
                </div>
                {/* </div> */}
                 </section>
            <section className="privacy-section">
              <h2 className="section-title">
                4. Information Sharing and Disclosure
              </h2>
              <div className="section-content">
                {/* <div className="highlight-box"> */}
                 We do not rent, sell, or trade your personal information.
                {/* </div> */}
              We only share it under limited
circumstances:
                <ul>
                  <li>
                    <strong>Service Providers:</strong> With trusted partners helping operate Vala.ai, all under strict
NDAs
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required to comply with laws, legal proceedings, or law
enforcement requests
                  </li>
                  <li>
                    <strong>Platform Protection:</strong> To prevent misuse and protect Vala.ai, its users, and the public
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In case of a merger or acquisition, with advance notice to users
                  </li>
                </ul>
              </div>
            </section>

            <section className="privacy-section">
              <h2 className="section-title">5. Data Security and Protection</h2>
              <div className="section-content">
               We use robust industry-standard security practices to keep your data on Vala.ai safe:
                <ul>
                  <li>
                    <strong>Encryption:</strong> All data is encrypted in transit (TLS) and at rest (AES-256)
                  </li>
                  <li>
                    <strong>Access Controls:</strong> Only authorized personnel can access personal data
                  </li>
                  <li>
                    <strong>Audits and Monitoring:</strong>Regular security audits and third-party penetration testing
                  </li>
                  {/* <li>
                    <strong>Data Centers:</strong> Our data is stored in SOC 2
                    Type II certified data centers
                  </li> */}
                  <li>
                    <strong>Incident Response:</strong> Clear procedures in place for managing security breaches
                  </li>
                </ul>
              </div>
            </section>

            <section className="privacy-section">
              <h2 className="section-title">6. Your Rights and Choices</h2>
              <div className="section-content">
                You have the right to:
                <ul>
                  <li>
                    <strong>Access</strong> your personal data stored by Vala.ai
                  </li>
                  <li>
                    <strong>Correct</strong> any inaccurate or outdated information
                  </li>
                  <li>
                    <strong>Request Deletion</strong> of your data, subject to legal obligations
                  </li>
                  <li>
                    <strong>Receive a Copy</strong> of your data in a structured, portable format
                  </li>
                  <li>
                    <strong>Object</strong> to certain processing activities
                  </li>
                  <li>
                    <strong>Withdraw Consent</strong> at any time where consent is required
                  </li>
                  <li>
                    <strong>Opt Out</strong> of optional communications
                  </li>
                </ul>
                To exercise your rights, please email us at:   <a
  href="mailto:vala.ai@goodpartnerske.org"
  className="contact-email text-blue-600 hover:underline"
>
  vala.ai@goodpartnerske.org
</a> with the subject line
<strong>"Data Access Request." </strong>We will acknowledge within <strong>7 business days</strong> and fulfill your request
within <strong>30 days.</strong>
              </div>
            </section>

            <section className="privacy-section">
              <h2 className="section-title">7. Consent Management</h2>
              <div className="section-content">
               By using Vala.ai, you consent to the collection, use, and storage of your data as described in this
policy. Where legally required, we will ask for your explicit consent before collecting certain
types of data or using non-essential cookies.
                {/* <ul>
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
                </ul> */}
              </div>
            </section>

            <section className="privacy-section">
              <h2 className="section-title">8. Automated Decision-Making</h2>
              <div className="section-content">
                Some features of Vala.ai may involve automated decision-making to deliver personalized
experiences. These do not have legal or significant personal effects. You may request human
review of any decision that affects your rights.
              </div>
            </section>

            <section className="privacy-section">
              <h2 className="section-title">9. Data Retention</h2>
              <div className="section-content">
                We retain your data only as long as needed to deliver Vala.ai services and comply with legal
obligations:
 <ul>
                  <li>
                    Account information is kept while your account remains active
                  </li>
                  <li>
                    Uploaded documents are retained per your organization’s preferences
                  </li>
                  <li>
                    Usage logs are stored for up to 24 months
                  </li>
                  <li>Deleted data is permanently removed within 30 days</li>
                </ul>
              </div>
            </section>

            <section className="privacy-section">
              <h2 className="section-title">10. Data Breach Notification</h2>
              <div className="section-content">
                In the unlikely event of a data breach affecting your personal data, Vala.ai will notify affected
users and relevant authorities promptly, in line with applicable data protection laws.
                {/* <ul>
                  <li>
                    Update the "Last updated" date at the top of this policy
                  </li>
                  <li>Notify users via email for significant changes</li>
                  <li>Provide prominent notice on our platform</li>
                  <li>Allow time for review before changes take effect</li>
                </ul> */}
              </div>
            </section>
            <section className="privacy-section">
              <h2 className="section-title">11. International Data Transfers</h2>
              <div className="section-content">
                Your data may be processed in jurisdictions outside your country of residence. Vala.ai ensures
that such transfers comply with applicable laws and include safeguards to protect your
information.
              </div>
            </section>
             <section className="privacy-section">
              <h2 className="section-title">12. Children’s Privacy</h2>
              <div className="section-content">
             Vala.ai is not intended for individuals under the age of 18. We do not knowingly collect personal
information from minors. If we discover that we have collected such data, it will be deleted
promptly.
              </div>
            </section>
            <section className="privacy-section">
              <h2 className="section-title">13. Changes to This Privacy Policy</h2>
              <div className="section-content">
               We may update this policy from time to time. When we do:
                <ul>
                  <li>
                    The “Last updated” date will be revised
                  </li>
                  <li>Significant changes will be communicated via email and platform notifications</li>
                  <li>We’ll allow a grace period for review before changes take effect</li>
                </ul>
              </div>
            </section>


            <section className="privacy-section">
              <h2 className="section-title">14. Contact Us</h2>
              <div className="section-content">
                <div className="contact-info">
                  If you have any questions or concerns about this Privacy Policy or how your data is handled on
Vala.ai, contact us at:
                  <br />
                  {/* <br /> */}
                  <strong>Email:</strong>{" "}
   <a
  href="mailto:vala.ai@goodpartnerske.org"
  className="contact-email text-blue-600 hover:underline"
>
  vala.ai@goodpartnerske.org
</a>
                  {/* <br /> */}
                  {/* <strong>General Support:</strong>{" "}
                                                <a
  href="mailto:info@goodpartnerske.org"
  className="contact-email text-blue-600 hover:underline"
>
 info@goodpartnerske.org
</a>
                  <br /> */}
                  {/* <br /> */}
                  We aim to respond within 48 hours.
                </div>
              </div>
            </section>
          </div>

          <div className="privacy-footer">
           
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
