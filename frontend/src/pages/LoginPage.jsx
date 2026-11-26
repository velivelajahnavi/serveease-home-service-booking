import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api, { BACKEND_URL } from '../services/api';
import { getHomeRouteForRole, useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(
    searchParams.get('error') === 'account_inactive'
      ? 'Your account is currently deactivated. Contact admin.'
      : ''
  );
  const [submitting, setSubmitting] = useState(false);

  // Forgot / Reset Password toggle state
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const profile = await login(email, password);
      navigate(getHomeRouteForRole(profile.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setResetMsg('');
    setError('');
    try {
      const { data } = await api.post('/auth/forgot-password', { email: resetEmail });
      setResetMsg(data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not generate reset token.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMsg('');
    setError('');
    try {
      const { data } = await api.post('/auth/reset-password', {
        token: resetToken,
        newPassword,
      });
      setResetMsg(data.message);
      setResetToken('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Password reset failed.');
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
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="fw-bold text-center mb-1">Welcome Back</h3>
              <p className="text-muted text-center small mb-4">
                Common login for Admin, Customer, and Service Provider
              </p>

              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              {resetMsg && <div className="alert alert-success py-2 small">{resetMsg}</div>}

              {!showReset ? (
                <>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@serveease.com"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                      />
                    </div>

                    <div className="d-flex justify-content-end mb-3">
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 text-decoration-none"
                        onClick={() => {
                          setShowReset(true);
                          setError('');
                          setResetMsg('');
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100 mb-3"
                      disabled={submitting}
                    >
                      {submitting ? 'Signing in...' : 'Login with Email'}
                    </button>
                  </form>

                  {/* <div className="text-center text-muted small my-2">— OR —</div>

                  <button
                    type="button"
                    className="btn btn-outline-dark w-100 mb-3"
                    onClick={handleGoogleLogin}
                  >
                    Continue with Google (OAuth2.0)
                  </button> */}

                  <p className="text-center small mb-3">
                    New customer?{' '}
                    <Link to="/register" className="text-decoration-none fw-semibold">
                      Create an account
                    </Link>
                  </p>
                  
                  {/* Quick Demo Credentials Helper */}
                  {import.meta.env.VITE_DEMO_MODE === 'true' && (   
                  <div className="border-top pt-3">
                    <div className="small text-muted fw-semibold mb-2">Quick Fill Demo Accounts:</div>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => fillDemo('admin@serveease.com', 'Admin@123')}
                      >
                        Admin
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => fillDemo('customer@serveease.com', 'Customer@123')}
                      >
                        Customer
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => fillDemo('ravi.provider@serveease.com', 'Provider@123')}
                      >
                        Provider (Ravi)
                      </button>
                    </div>
                  </div>
                  )}
                </>
              ) : (
                <div>
                  <h6 className="fw-bold mb-3">Password Reset</h6>
                  <form onSubmit={handleRequestToken} className="mb-3">
                    <label className="form-label small">Step 1: Enter account email</label>
                    <div className="input-group">
                      <input
                        type="email"
                        className="form-control"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="email@serveease.com"
                        required
                      />
                      <button className="btn btn-outline-primary" type="submit">
                        Get Token
                      </button>
                    </div>
                  </form>

                  <form onSubmit={handleResetPassword} className="mb-3">
                    <div className="mb-2">
                      <label className="form-label small">Step 2: Paste Reset Token</label>
                      <input
                        type="text"
                        className="form-control"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                      Reset Password
                    </button>
                  </form>

                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0"
                    onClick={() => {
                      setShowReset(false);
                      setError('');
                      setResetMsg('');
                    }}
                  >
                    ← Back to Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}