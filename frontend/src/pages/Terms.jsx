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
                By accessing and using Vala.ai, AI Knowledge Assistant platform, you agree to comply with and
be bound by these Terms and Conditions. If you do not agree with any part of these terms,
please do not use our services. Your continued use of the platform constitutes acceptance of
these terms.
              </div>
            </section>

            <section className="terms-section">
              <h2 className="section-title">2. User Eligibility</h2>
              <div className="section-content">
                You must be at least 18 years of age and legally capable of entering into binding agreements.
Use of the platform by anyone under 18 is strictly prohibited. By using our services, you
represent and warrant that you meet these age requirements.
              </div>
            </section>

            <section className="terms-section">
              <h2 className="section-title">3. Account Responsibility</h2>
              <div className="section-content">
               Users are responsible for
                <ul>
                  <li>
                    Maintaining the confidentiality of their login credentials and all activities that occur
under their account. You agree to:
                  </li>
                  <li>Provide accurate and complete information during registration</li>
                  <li>
                    Maintain the security of your password and account
                  </li>
                   <li>
                   Notify us immediately of any unauthorized use of your account
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
                You agree not to use the platform for any unlawful, harmful, or abusive purpose. Prohibited
activities include but are not limited to:
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
               All content on the platform, including but not limited to code, text, graphics, logos, and
software, are the intellectual property of Good Partners Limited and Vala.ai AI Knowledge
Assistant and are protected by copyright and other intellectual property laws. You may not
reproduce, distribute, or create derivative works without our express written permission.
              </div>
            </section>

            <section className="terms-section">
              <h2 className="section-title">6. Data and Privacy</h2>
              <div className="section-content">
                Your privacy is important to us. Our collection and use of personal information is governed by
our Privacy Policy. By using our services, you consent to the collection and use of your
information as described in our Privacy Policy.
              </div>
            </section>

            <section className="terms-section">
              <h2 className="section-title">7. Limitation of Liability</h2>
              <div className="section-content">
                We are not liable for any direct, indirect, incidental, special, or consequential damages resulting
from your use of the platform. All services are provided "as-is" without any warranties, express
or implied. Our total liability shall not exceed the amount paid by you for the services.
              </div>
            </section>

            <section className="terms-section">
              <h2 className="section-title">8. Modifications</h2>
              <div className="section-content">
                We may revise these Terms at any time by posting updated terms on our platform. Continued
use of the platform after such changes constitutes your acceptance of the new Terms. We
recommend reviewing these terms periodically for any updates.
              </div>
            </section>
             <section className="terms-section">
              <h2 className="section-title">9. Service Availability and Changes</h2>
              <div className="section-content">
                We reserve the right to modify, suspend, or discontinue any aspect of the platform at any time
without prior notice. We are not liable for any unavailability, interruptions, or loss of data that
may occur due to system maintenance or unforeseen issues.
              </div>
            </section>
             <section className="terms-section">
              <h2 className="section-title">10. User-Generated Content</h2>
              <div className="section-content">
                If users submit content (e.g., feedback, prompts, or input data), you grant us a non-exclusive,
royalty-free, worldwide license to use, store, and display this content for the purpose of
improving our services. You are solely responsible for the legality and accuracy of such content.
              </div>
            </section>
              <section className="terms-section">
              <h2 className="section-title">11. Third-Party Services and Links</h2>
              <div className="section-content">
                Our platform may include links or integrations with third-party services. We do not control and
are not responsible for the content, privacy policies, or practices of any third-party websites or
services. Use of third-party services is at your own risk.
              </div>
            </section>
            <section className="terms-section">
              <h2 className="section-title">12. Termination</h2>
              <div className="section-content">
               We reserve the right to suspend or terminate your access to the platform at our sole discretion,
without prior notice, if you violate these Terms or engage in conduct that we deem harmful to
the platform, other users, or our business.
              </div>
            </section>
             <section className="terms-section">
              <h2 className="section-title">13. Governing Law and Dispute Resolution</h2>
              <div className="section-content">
               The Laws of Kenya shall govern the validity, interpretation and enforceability of these terms;
including the Kenya Data Protection Act of 2019. Any disputes arising from or related to the use
of our platform shall be subject to the exclusive jurisdiction of the courts of Kenya.
              </div>
            </section>
             <section className="terms-section">
              <h2 className="section-title">14. No Waiver</h2>
              <div className="section-content">
               Our failure to enforce any right or provision of these Terms will not be considered a waiver of
those rights. If any provision is found to be unenforceable, the remaining provisions will remain
in effect.
              </div>
            </section>
             <section className="terms-section">
              <h2 className="section-title">15. Beta Services</h2>
              <div className="section-content">
               From time to time, we may offer features marked as &quot;Beta&quot; or &quot;Preview.&quot; These are
experimental and may not work as intended. Use of such features is at your own risk, and we
make no guarantees regarding their reliability or availability.
              </div>
            </section>
             <section className="terms-section">
              <h2 className="section-title">16. Indemnification</h2>
              <div className="section-content">
               You agree to indemnify and hold harmless Good Partners Limited and all its affiliates,
employees, and agents from any claims, damages, obligations, losses, or expenses (including
attorney fees) arising from your use of the platform, violation of these Terms, or infringement
of any third-party rights.
              </div>
            </section>
             <section className="terms-section">
              <h2 className="section-title">17. Feedback</h2>
              <div className="section-content">
              We welcome feedback and suggestions. However, any feedback you provide shall be deemed
non-confidential, and we shall be free to use it without any obligation or compensation to you.
              </div>
            </section>
             <section className="terms-section">
              <h2 className="section-title">18. License to Use the Platform</h2>
              <div className="section-content">
               Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-
transferable, and revocable license to access and use the platform for personal or internal
business purposes. You may not resell, sublicense, or use the platform for commercial time-
sharing purposes.
              </div>
            </section>
             <section className="terms-section">
              <h2 className="section-title">19. Prohibited AI Use Cases</h2>
              <div className="section-content">
               To ensure ethical use of vala.ai, users must not use the platform to:
               <ul>
                <li>Generate or distribute false or misleading information</li>
                <li>Violate any individual's privacy or confidentiality</li>
                <li>Train competing machine learning models without our permission</li>
                <li>Facilitate or promote hate speech, violence, or discrimination
Violation of these restrictions may result in suspension or termination of your access,
and legal action where applicable.</li>
               </ul>
              </div>
            </section>
             <section className="terms-section">
              <h2 className="section-title">20. Security</h2>
              <div className="section-content">
               We take reasonable steps to protect the integrity and security of the platform and your data.
However, no system is completely secure. You acknowledge that use of the platform carries
inherent security risks and agree to use it at your own discretion.
              </div>
            </section>
             <section className="terms-section">
              <h2 className="section-title">21. Subscription and Billing (if applicable)</h2>
              <div className="section-content">
                  <ul>
                <li>Fees, payment terms, and billing cycles will be outlined during subscription.</li>
                <li>You are responsible for all applicable taxes.</li>
                <li>Failure to pay may result in suspension or termination of your account.</li>
                <li>We reserve the right to change pricing with reasonable notice.</li>
               </ul>
              </div>
            </section>
             <section className="terms-section">
              <h2 className="section-title">22. Children’s Privacy</h2>
              <div className="section-content">
               Our services are not intended for or directed at individuals under the age of 18. We do not
knowingly collect personal information from children. If you believe that a child has provided us
with personal data, please contact us and we will take appropriate steps to delete such
information.
              </div>
            </section>
             <section className="terms-section">
              <h2 className="section-title">23. Entire Agreement</h2>
              <div className="section-content">
               These Terms, together with our Privacy Policy, constitute the entire agreement between you
and Good Partners Limited regarding the use of Vala.ai, the AI Knowledge Assistant platform
and supersede all prior agreements, whether oral or written.
              </div>
            </section>

            <section className="terms-section">
              <h2 className="section-title">24. Contact Information</h2>
              <div className="section-content">
                <div className="contact-info">
                  If you have any questions about these Terms and Conditions,
                  please contact us at:
                  <br />
                  <br />
               <a
  href="mailto:vala.ai@goodpartnerske.org"
  className="contact-email text-blue-600 hover:underline"
>
  vala.ai@goodpartnerske.org
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
