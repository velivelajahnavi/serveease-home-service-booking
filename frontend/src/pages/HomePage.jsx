import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { getHomeRouteForRole, useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  const location = useLocation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/public/services')
      .then((res) => setServices(res.data))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  // Smooth scroll when clicking #about, #help, #contact, #services from Navbar or Footer
  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(location.hash.replace('#', ''));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="se-hero py-5">
        <div className="container py-lg-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="se-hero-pill mb-3">
                <span>★</span>
                <span>Trusted Doorstep Home Services</span>
                
              </div>

              <h1 className="display-5 fw-bold mb-3" style={{ lineHeight: 1.15 }}>
                Home Repairs &amp; Cleaning,{' '}
                <span style={{ color: '#38bdf8' }}>Booked in Minutes.</span>
              </h1>

              <p className="lead text-light opacity-75 mb-4" style={{ maxWidth: '580px' }}>
                From plumbing and electrical fixes to AC servicing and deep home cleaning—get background-verified professionals at upfront prices with guaranteed time slots.
              </p>

              <div className="mb-4">
                <div className="se-sunday-chip">
                  <span>📅</span>
                  <span>
                    Service Hours: <strong>Mon – Sat, 9:00 AM – 6:00 PM</strong> &nbsp;·&nbsp; <strong>Closed on Sundays</strong>
                  </span>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-3">
                {user ? (
                  <>
                    <Link
                      to={getHomeRouteForRole(user.role)}
                      className="btn btn-primary btn-lg px-4 shadow"
                    >
                      Go to My Dashboard
                    </Link>
                    {user.role === 'CUSTOMER' && (
                      <Link
                        to="/customer/services"
                        className="btn btn-outline-light btn-lg px-4"
                      >
                        Book a Service
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg px-4 shadow">
                      Book Your First Service
                    </Link>
                    <Link to="/login" className="btn btn-outline-light btn-lg px-4">
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* How It Works Visual Card (replaces the old technical notice board) */}
            <div className="col-lg-5">
              <div className="se-glass-card p-4 p-lg-4 shadow-lg">
                <h5 className="fw-bold mb-3">How ServeEase Works</h5>
                <div className="d-grid gap-3">
                  <div className="d-flex gap-3 align-items-start">
                    <span className="se-step-num">1</span>
                    <div>
                      <div className="fw-semibold">Choose Your Service</div>
                      <div className="small text-light opacity-75">
                        Browse fixed-price home services with clear duration and upfront pricing.
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-3 align-items-start">
                    <span className="se-step-num">2</span>
                    <div>
                      <div className="fw-semibold">Pick a Convenient Slot</div>
                      <div className="small text-light opacity-75">
                        Select any Monday–Saturday slot and your preferred available technician.
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-3 align-items-start">
                    <span className="se-step-num">3</span>
                    <div>
                      <div className="fw-semibold">Relax &amp; Track Live</div>
                      <div className="small text-light opacity-75">
                        Follow booking status from confirmation to job completion in real time.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Catalog */}
      <section id="services" className="container py-5">
        <div className="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-2">
          <div>
            <span className="text-primary fw-bold small text-uppercase">Our Catalog</span>
            <h2 className="fw-bold mb-1 mt-1">Popular Home Services</h2>
            <p className="text-muted mb-0">
              Transparent pricing with zero hidden charges—performed by skilled professionals.
            </p>
          </div>
          {user?.role === 'CUSTOMER' && (
            <Link to="/customer/services" className="btn btn-outline-primary btn-sm px-3">
              View All &amp; Filter →
            </Link>
          )}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : services.length === 0 ? (
          <div className="alert alert-info">No active services available right now.</div>
        ) : (
          <div className="row g-4">
            {services.map((service) => (
              <div className="col-md-6 col-lg-3" key={service.id}>
                <div className="card h-100 se-service-card shadow-sm">
                  <div className="card-body d-flex flex-column p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="se-category-badge">{service.category}</span>
                      <span className="text-muted small">{service.durationMins} mins</span>
                    </div>

                    <h5 className="card-title fw-bold mb-2">{service.serviceName}</h5>
                    <p className="card-text text-secondary small flex-grow-1">
                      {service.description || 'Professional doorstep home service.'}
                    </p>

                    <div className="border-top pt-3 mt-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <div className="small text-muted">Starts at</div>
                          <span className="fs-4 fw-bold text-dark">₹{service.basePrice}</span>
                        </div>
                        <span className="badge bg-success-subtle text-success rounded-pill px-2 py-1">
                          {service.assignedProviders?.length || 0} Pros Ready
                        </span>
                      </div>
                      <Link
                        to={user?.role === 'CUSTOMER' ? '/customer/services' : '/login'}
                        className="btn btn-primary btn-sm w-100 py-2"
                      >
                        {user?.role === 'CUSTOMER' ? 'Book Now' : 'Login to Book'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About Us Section */}
      <section id="about" className="bg-white border-top border-bottom py-5">
        <div className="container py-2">
          <div className="row align-items-center g-4">
            <div className="col-lg-5">
              <span className="text-primary fw-bold small text-uppercase">About Us</span>
              <h2 className="fw-bold mt-1 mb-3">
                Making Everyday Home Care Simple &amp; Dependable
              </h2>
              <p className="text-secondary mb-3">
                ServeEase connects households with skilled, verified local professionals for plumbing, electrical work, AC maintenance, and deep home cleaning—without the hassle of endless phone calls or surprise quotes.
              </p>
              <p className="text-secondary mb-0">
                Every service comes with upfront pricing, dedicated technician assignment, and easy status tracking right from your dashboard.
              </p>
            </div>

            <div className="col-lg-7">
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="card h-100 p-3 shadow-sm">
                    <div className="se-icon-box mb-3">✓</div>
                    <h6 className="fw-bold">Verified Professionals</h6>
                    <p className="small text-secondary mb-0">
                      Every technician is vetted and matched specifically to their area of expertise.
                    </p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="card h-100 p-3 shadow-sm">
                    <div className="se-icon-box mb-3">₹</div>
                    <h6 className="fw-bold">Upfront Standard Pricing</h6>
                    <p className="small text-secondary mb-0">
                      Know your exact base service fee before booking—no unexpected last-minute surprises.
                    </p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="card h-100 p-3 shadow-sm">
                    <div className="se-icon-box mb-3">⏱</div>
                    <h6 className="fw-bold">Punctual 2-Hour Slots</h6>
                    <p className="small text-secondary mb-0">
                      Pick a slot between 9 AM and 6 PM (Monday to Saturday) that fits your routine.
                    </p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="card h-100 p-3 shadow-sm">
                    <div className="se-icon-box mb-3">💬</div>
                    <h6 className="fw-bold">Dedicated Customer Care</h6>
                    <p className="small text-secondary mb-0">
                      Need to reschedule or cancel? Manage bookings easily online or call our support desk.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Help / FAQs */}
      <section id="help" className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="text-center mb-4">
              <span className="text-primary fw-bold small text-uppercase">Customer Help</span>
              <h2 className="fw-bold mt-1">Frequently Asked Questions</h2>
              <p className="text-muted">Quick answers about bookings, timings, and cancellations.</p>
            </div>

            <div className="accordion shadow-sm rounded-4 overflow-hidden" id="helpAccordion">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button fw-semibold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq1"
                  >
                    What are your working days and hours?
                  </button>
                </h2>
                <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#helpAccordion">
                  <div className="accordion-body text-secondary small">
                    ServeEase operates <strong>Monday through Saturday, 9:00 AM to 6:00 PM</strong> across four convenient 2-hour booking slots. <strong>Sundays are a weekly holiday</strong> so our technicians can rest and recharge.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed fw-semibold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq2"
                  >
                    Can I cancel a booking if my plans change?
                  </button>
                </h2>
                <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#helpAccordion">
                  <div className="accordion-body text-secondary small">
                    Yes. Simply open <strong>My Bookings</strong> in your Customer portal and click <strong>Cancel</strong> on any upcoming booking that has not yet been completed.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed fw-semibold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq3"
                  >
                    Can I book a same-day service?
                  </button>
                </h2>
                <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#helpAccordion">
                  <div className="accordion-body text-secondary small">
                    Yes! You can book any upcoming time slot for today (Monday to Saturday) as long as the slot has not already started and a technician is available.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed fw-semibold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq4"
                  >
                    How do I track my technician and booking status?
                  </button>
                </h2>
                <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#helpAccordion">
                  <div className="accordion-body text-secondary small">
                    Your <strong>My Bookings</strong> page displays the assigned provider&apos;s name, contact number, scheduled slot, and live status updates (Pending → Confirmed → In Progress → Completed).
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Strip */}
      <section id="contact" className="container pb-5">
        <div className="card border-0 shadow-sm overflow-hidden" style={{ background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)' }}>
          <div className="card-body p-4 p-lg-5 text-white">
            <div className="row align-items-center g-4">
              <div className="col-lg-7">
                <h3 className="fw-bold mb-2">Need Help With a Booking?</h3>
                <p className="mb-0 opacity-75">
                  Our support team is available Monday to Saturday, 9:00 AM – 6:00 PM (closed Sundays) to assist with bookings, service queries, or feedback.
                </p>
              </div>
              <div className="col-lg-5">
                <div className="bg-white bg-opacity-10 rounded-4 p-3 d-grid gap-2 small">
                  <div><strong>Email:</strong> support@serveease.in</div>
                  <div><strong>Phone:</strong> +91 98765 43210</div>
                  <div><strong>Address:</strong> Marathahalli, Bangalore, Karnataka</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}