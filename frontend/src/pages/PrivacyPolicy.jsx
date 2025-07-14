import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>

      <p className="mb-6 text-lg">
        This Privacy Policy describes how your information is collected, used,
        and shared when you use our platform (the "Service").
      </p>

      {/* Information We Collect */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Personal Information:</strong> First name, last name, email address, password, job title, and company serial code.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you use our platform, including log data, IP address, browser type, and pages visited.
          </li>
          <li>
            <strong>Cookies:</strong> We may use cookies to enhance your experience and analyze usage.
          </li>
        </ul>
      </section>

      {/* How We Use Your Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">2. How We Use Your Information</h2>
        <p>
          We use the collected data to:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Provide and maintain the Service</li>
          <li>Communicate with you about updates, promotions, and announcements</li>
          <li>Monitor usage and improve platform features</li>
          <li>Ensure security and prevent fraud or abuse</li>
        </ul>
      </section>

      {/* Sharing Your Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">3. Sharing Your Information</h2>
        <p>
          We do not sell, rent, or share your personal information with third parties
          except:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>With service providers who help us operate the platform (under confidentiality agreements)</li>
          <li>To comply with legal obligations or protect our rights</li>
        </ul>
      </section>

      {/* Data Security */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">4. Data Security</h2>
        <p>
          We implement technical and organizational measures to protect your information
          from unauthorized access, disclosure, alteration, or destruction.
        </p>
      </section>

      {/* Your Rights */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">5. Your Rights and Choices</h2>
        <p>
          You may:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Access or update your personal data</li>
          <li>Request deletion of your account</li>
          <li>Withdraw consent to email communication at any time</li>
        </ul>
      </section>

      {/* Children’s Privacy */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">6. Children’s Privacy</h2>
        <p>
          Our Service is not intended for children under the age of 13. We do not knowingly
          collect personal data from children.
        </p>
      </section>

      {/* Changes */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy occasionally. When we do, we will revise the
          “Last updated” date and notify users as needed.
        </p>
      </section>

      {/* Contact */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">8. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy, please contact us
          at: <a href="mailto:support@yourdomain.com" className="text-blue-600">support@yourdomain.com</a>
        </p>
      </section>

      <p className="text-sm text-gray-500 text-right">Last updated: July 2025</p>
    </div>
  );
};

export default PrivacyPolicy;
