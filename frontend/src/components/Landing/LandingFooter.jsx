import React from "react";
import { Link } from "react-router-dom";
import "../../styles/LandingFooter.css";

function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-container">
        <div className="landing-footer-main">
          <div className="landing-footer-brand">
            <h3 className="landing-footer-logo">Vala AI</h3>
            <p className="landing-footer-description">
              We are experts in knowledge management software. We help companies enable their employees to work more efficiently, align teams, and achieve better results.
            </p>
          </div>

          <div className="landing-footer-links">
            <div className="footer-link-group">
              <h4 className="footer-link-title">Product</h4>
              <ul className="footer-link-list">
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li><Link to="/features" className="footer-link">Features</Link></li>
                <li><Link to="/contact" className="footer-link">Schedule a demo</Link></li>
              </ul>
            </div>

            <div className="footer-link-group">
              <h4 className="footer-link-title">Company</h4>
              <ul className="footer-link-list">
                <li><Link to="/about" className="footer-link">About</Link></li>
                <li><span className="footer-link">Domains</span></li>
                <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
              </ul>
            </div>

            <div className="footer-link-group">
              <h4 className="footer-link-title">Contact Us</h4>
              <div className="footer-contact-info">
                <div className="contact-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z" fill="#080808"/>
                  </svg>
                  <span>+254 711 085 400</span>
                </div>
                <div className="contact-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#080808"/>
                  </svg>
                  <span>vala.ai@vala.ke</span>
                </div>
                <div className="contact-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#080808"/>
                  </svg>
                  <span>Nairobi, Kenya</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="landing-footer-divider"></div>

        <div className="landing-footer-bottom">
          <div className="landing-footer-cta">
            <h3 className="footer-cta-title">Unlock Knowledge Power</h3>
            <p className="footer-cta-description">
              Experience the power of knowledge. Request a demo to get started with vala ai
            </p>
            <div className="footer-cta-buttons">
              <Link to="/contact" className="footer-cta-primary">
                Request a Demo
              </Link>
              <Link to="/login" className="footer-cta-secondary">
                Login Now
              </Link>
            </div>
          </div>

          <div className="landing-footer-legal">
            <div className="footer-social">
              <a href="#" className="social-link facebook" aria-label="Facebook">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 0C8.9544 0 0 8.9544 0 20C0 29.3792 6.4576 37.2496 15.1688 39.4112V26.112H11.0448V20H15.1688V17.3664C15.1688 10.5592 18.2496 7.404 24.9328 7.404C26.2 7.404 28.3864 7.6528 29.2808 7.9008V13.4408C28.8088 13.3912 27.9888 13.3664 26.9704 13.3664C23.6912 13.3664 22.424 14.6088 22.424 17.8384V20H28.9568L27.8344 26.112H22.424V39.8536C32.3272 38.6576 40.0008 30.2256 40.0008 20C40 8.9544 31.0456 0 20 0Z" fill="#32137F"/>
                </svg>
              </a>
              <a href="#" className="social-link twitter" aria-label="Twitter">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30.5441 3.17285H36.1666L23.8832 17.212L38.3337 36.3161H27.0191L18.157 24.7296L8.0169 36.3161H2.39105L15.5294 21.2997L1.66699 3.17285H13.2688L21.2793 13.7634L30.5441 3.17285ZM28.5708 32.9508H31.6863L11.576 6.3614H8.23276L28.5708 32.9508Z" fill="#32137F"/>
                </svg>
              </a>
              <a href="#" className="social-link linkedin" aria-label="LinkedIn">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M37.0391 0H2.95312C1.32031 0 0 1.28906 0 2.88281V37.1094C0 38.7031 1.32031 40 2.95312 40H37.0391C38.6719 40 40 38.7031 40 37.1172V2.88281C40 1.28906 38.6719 0 37.0391 0ZM11.8672 34.0859H5.92969V14.9922H11.8672V34.0859ZM8.89844 12.3906C6.99219 12.3906 5.45312 10.8516 5.45312 8.95312C5.45312 7.05469 6.99219 5.51562 8.89844 5.51562C10.7969 5.51562 12.3359 7.05469 12.3359 8.95312C12.3359 10.8438 10.7969 12.3906 8.89844 12.3906ZM34.0859 34.0859H28.1562V24.8047C28.1562 22.5938 28.1172 19.7422 25.0703 19.7422C21.9844 19.7422 21.5156 22.1562 21.5156 24.6484V34.0859H15.5938V14.9922H21.2812V17.6016H21.3594C22.1484 16.1016 24.0859 14.5156 26.9688 14.5156C32.9766 14.5156 34.0859 18.4688 34.0859 23.6094V34.0859Z" fill="#32137F"/>
                </svg>
              </a>
              <a href="#" className="social-link whatsapp" aria-label="WhatsApp">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 40L2.81166 29.7283C1.07666 26.7217 0.165 23.3133 0.166666 19.8183C0.171666 8.89167 9.06331 0 19.9883 0C25.2899 0.00166667 30.2666 2.06667 34.0099 5.81333C37.7516 9.56 39.8116 14.54 39.8099 19.8367C39.8049 30.765 30.9133 39.6567 19.9883 39.6567C16.6716 39.655 13.4033 38.8233 10.5083 37.2433L0 40ZM10.995 33.655C13.7883 35.3133 16.455 36.3067 19.9816 36.3083C29.0616 36.3083 36.4583 28.9183 36.4633 19.8333C36.4666 10.73 29.1049 3.35 19.995 3.34667C10.9083 3.34667 3.51666 10.7367 3.51333 19.82C3.51166 23.5283 4.59832 26.305 6.42332 29.21L4.75832 35.29L10.995 33.655ZM29.9733 24.5483C29.8499 24.3417 29.5199 24.2183 29.0233 23.97C28.5283 23.7217 26.0933 22.5233 25.6383 22.3583C25.1849 22.1933 24.8549 22.11 24.5233 22.6067C24.1933 23.1017 23.2433 24.2183 22.9549 24.5483C22.6666 24.8783 22.3766 24.92 21.8816 24.6717C21.3866 24.4233 19.79 23.9017 17.8983 22.2133C16.4266 20.9 15.4316 19.2783 15.1433 18.7817C14.855 18.2867 15.1133 18.0183 15.36 17.7717C15.5833 17.55 15.855 17.1933 16.1033 16.9033C16.355 16.6167 16.4366 16.41 16.6033 16.0783C16.7683 15.7483 16.6866 15.4583 16.5616 15.21C16.4366 14.9633 15.4466 12.525 15.035 11.5333C14.6316 10.5683 14.2233 10.6983 13.92 10.6833L12.97 10.6667C12.64 10.6667 12.1033 10.79 11.65 11.2867C11.1966 11.7833 9.91664 12.98 9.91664 15.4183C9.91664 17.8567 11.6916 20.2117 11.9383 20.5417C12.1866 20.8717 15.43 25.875 20.3983 28.02C21.58 28.53 22.5033 28.835 23.2216 29.0633C24.4083 29.44 25.4883 29.3867 26.3416 29.26C27.2933 29.1183 29.2716 28.0617 29.6849 26.905C30.0983 25.7467 30.0983 24.755 29.9733 24.5483Z" fill="#32137F"/>
                </svg>
              </a>
            </div>
            
            <div className="footer-legal-links">
              <Link to="/privacy" className="footer-legal-link">Privacy Policy</Link>
              <Link to="/terms" className="footer-legal-link">Terms of Use</Link>
            </div>
            
            <p className="footer-copyright">
              © 2025 vala.ai under Good Partners. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
