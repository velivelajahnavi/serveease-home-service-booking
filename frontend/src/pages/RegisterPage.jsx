import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getHomeRouteForRole, useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const profile = await register(form);
      navigate(getHomeRouteForRole(profile.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="se-auth-page">
    <div className="container">
        <div className="text-center mb-4">
        <Link
            to="/"
            className="d-inline-flex align-items-center gap-2 text-white text-decoration-none fw-bold fs-4"
        >
            <span className="se-brand-icon">S</span>
            <span>ServeEase</span>
        </Link>
        </div>
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="fw-bold text-center mb-1">Customer Sign Up</h3>
              <p className="text-muted text-center small mb-4">
                Create your ServeEase account to book home services
              </p>

              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Password * (min 6 chars)</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      minLength={6}
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Door No, Street, Locality"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Guntur"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-4 mb-3"
                  disabled={submitting}
                >
                  {submitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <p className="text-center small mb-0">
                Already registered?{' '}
                <Link to="/login" className="text-decoration-none fw-semibold">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}