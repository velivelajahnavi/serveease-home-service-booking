import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="se-footer pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row g-4 pb-4 border-bottom border-secondary border-opacity-25">
          {/* Brand */}
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="se-brand-icon">S</span>
              <span className="fs-5 fw-bold text-white">ServeEase</span>
            </div>
            <p className="small text-secondary mb-3" style={{ maxWidth: '320px' }}>
              Reliable, verified doorstep home services for plumbing, electrical, appliance care, and deep cleaning—with transparent pricing and fixed time slots.
            </p>
            <div className="small text-warning-emphasis bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded-3 px-3 py-2 d-inline-block">
              <span className="text-warning fw-semibold">Service Hours:</span>{' '}
              <span className="text-light">Mon–Sat, 9 AM – 6 PM (Sunday Off)</span>
            </div>
          </div>

          {/* Company / About */}
          <div className="col-6 col-lg-2">
            <h6 className="text-white fw-bold mb-3">Company</h6>
            <ul className="list-unstyled small d-grid gap-2">
              <li><Link to="/#about">About Us</Link></li>
              <li><Link to="/#services">Our Services</Link></li>
            </ul>
          </div>

          {/* Customer Help */}
          <div className="col-6 col-lg-3">
            <h6 className="text-white fw-bold mb-3">Customer Help</h6>
            <ul className="list-unstyled small d-grid gap-2">
              <li><Link to="/#help">FAQs &amp; Help Center</Link></li>
              <li><Link to="/#contact">Report an Issue</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="col-lg-3">
            <h6 className="text-white fw-bold mb-3">Contact Us</h6>
            <ul className="list-unstyled small d-grid gap-2 text-secondary">
              <li>
                <span className="text-white fw-medium">Support:</span> support@serveease.in
              </li>
              <li>
                <span className="text-white fw-medium">Helpline:</span> +91 98765 43210
              </li>
              <li>
                <span className="text-white fw-medium">Office:</span> Marathahalli, Bangalore, Karnataka
              </li>
              <li>
                <span className="text-white fw-medium">Timings:</span> Mon–Sat (Closed Sundays)
              </li>
            </ul>
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-between align-items-center pt-3 small text-secondary gap-2">
          <div>© {new Date().getFullYear()} ServeEase Home Services. All rights reserved.</div>
          <div className="d-flex gap-3">
            <Link to="/#about">About Us</Link>
            <Link to="/#help">Customer Help</Link>
            {/* <Link to="/#contact">Contact Us</Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
}