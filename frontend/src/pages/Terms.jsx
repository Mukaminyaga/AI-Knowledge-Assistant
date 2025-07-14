import React from "react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Last updated: July 2025
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing and using our platform, you agree to comply with and be bound
          by these Terms and Conditions. If you do not agree, please do not use our services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">2. User Eligibility</h2>
        <p>
          You must be at least 18 years of age and legally capable of entering into binding agreements.
          Use of the platform by anyone under 18 is strictly prohibited.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">3. Account Responsibility</h2>
        <p>
          Users are responsible for maintaining the confidentiality of their login credentials.
          You agree to notify us immediately if you suspect any unauthorized use of your account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">4. Acceptable Use</h2>
        <p>
          You agree not to use the platform for any unlawful, harmful, or abusive purpose.
          Misuse of the platform may lead to account suspension or termination.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">5. Intellectual Property</h2>
        <p>
          All content on the platform, including code, text, graphics, and logos, are the
          intellectual property of the platform and may not be reproduced without permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">6. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to the platform
          at any time for violation of these Terms or any applicable law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">7. Limitation of Liability</h2>
        <p>
          We are not liable for any direct, indirect, incidental, or consequential damages
          resulting from your use of the platform. All services are provided "as-is."
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">8. Modifications</h2>
        <p>
          We may revise these Terms at any time. Continued use of the platform after such changes
          constitutes your consent to the new Terms.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-2">9. Contact</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
          <br />
          <a href="mailto:support@aiknowledgeassistant.com" className="text-blue-600 dark:text-blue-400">support@aiknowledgeassistant.com</a>
        </p>
      </section>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>
          Return to <Link to="/" className="text-blue-600 dark:text-blue-400 underline">Home</Link>
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
