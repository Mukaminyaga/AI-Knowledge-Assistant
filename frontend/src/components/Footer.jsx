import React from "react";
import { Link } from "react-router-dom";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiGithub,
  FiTwitter,
  FiLinkedin,
} from "react-icons/fi";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-brand">
            <img
              src="Vala Logo.png"
              alt="Vala.ai Logo"
              className="footer-logo"
            />
            <div className="footer-brand-text">
              <h3 className="footer-brand-title">Vala.ai</h3>
              <p className="footer-brand-subtitle">
                Empowering teams with intelligent knowledge discovery
              </p>
            </div>
          </div>
          <p className="footer-description">
            Transform how your team finds and shares knowledge with our
            AI-powered platform. Get instant answers from your documents,
            policies, and knowledge base.
          </p>
          <div className="footer-partners">
            <div className="partners-label">Powered by</div>
            <img
              src="Good Partners Main Logo II.jpg"
              alt="Good Partners Logo"
              className="partners-logo"
            />
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-section-title">Product</h4>
          <ul className="footer-links">
            <li>
              <Link to="/features" className="footer-link">
                Features
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="footer-link">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/integrations" className="footer-link">
                Integrations
              </Link>
            </li>
            <li>
              <Link to="/api" className="footer-link">
                API
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-section-title">Resources</h4>
          <ul className="footer-links">
            <li>
              <Link to="/docs" className="footer-link">
                Documentation
              </Link>
            </li>
            <li>
              <Link to="/support" className="footer-link">
                Support
              </Link>
            </li>
            <li>
              <Link to="/blog" className="footer-link">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/guides" className="footer-link">
                Guides
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-section-title">Company</h4>
          <ul className="footer-links">
            <li>
              <Link to="/about" className="footer-link">
                About
              </Link>
            </li>
            <li>
              <Link to="/careers" className="footer-link">
                Careers
              </Link>
            </li>
            <li>
              <Link to="/contact" className="footer-link">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="footer-link">
                Privacy
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-section-title">Contact</h4>
          <div className="footer-contact">
            <div className="contact-item">
              <FiMail className="contact-icon" />
              <span>@vala.ai@goodpartnerske.org</span>
            </div>
            <div className="contact-item">
              <FiPhone className="contact-icon" />
              <span>+254 711 085 400</span>
            </div>
            <div className="contact-item">
              <FiMapPin className="contact-icon" />
              <span>Marsabit Plaza,Ngong Rd</span>
            </div>
          </div>

          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Twitter">
              <FiTwitter />
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <FiLinkedin />
            </a>
            <a href="#" className="social-link" aria-label="GitHub">
              <FiGithub />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            © 2025 Vala.ai by Good Partners. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/terms" className="footer-bottom-link">
              Terms of Service
            </Link>
            <Link to="/privacy" className="footer-bottom-link">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="footer-bottom-link">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
