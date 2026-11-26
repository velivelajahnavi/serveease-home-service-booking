import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    specialization: '',
    experienceYears: 0,
    hourlyRate: 0,
    available: true,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        specialization: user.specialization || '',
        experienceYears: user.experienceYears ?? 0,
        hourlyRate: user.hourlyRate ?? 0,
        available: user.available ?? true,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);
    try {
      await api.put('/profile', {
        ...form,
        experienceYears: Number(form.experienceYears),
        hourlyRate: Number(form.hourlyRate),
      });
      await refreshProfile();
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">My Profile</h5>
              <span className="badge bg-primary">{user.role}</span>
            </div>
            <div className="card-body p-4">
              {message && <div className="alert alert-success py-2 small">{message}</div>}
              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Email (read-only)</label>
                    <input type="email" className="form-control" value={user.email} disabled />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Auth Provider / Status</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`${user.authProvider} • ${user.status}`}
                      disabled
                    />
                  </div>
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

                  {user.role !== 'ADMIN' && (
                    <div className="col-md-6">
                      <label className="form-label">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        className="form-control"
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  {user.role === 'CUSTOMER' && (
                    <>
                      <div className="col-md-8">
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          name="address"
                          className="form-control"
                          value={form.address}
                          onChange={handleChange}
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
                        />
                      </div>
                    </>
                  )}

                  {user.role === 'PROVIDER' && (
                    <>
                      <div className="col-md-4">
                        <label className="form-label">Employee Code</label>
                        <input
                          type="text"
                          className="form-control"
                          value={user.employeeCode || ''}
                          disabled
                        />
                      </div>
                      <div className="col-md-8">
                        <label className="form-label">Specialization</label>
                        <input
                          type="text"
                          name="specialization"
                          className="form-control"
                          value={form.specialization}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Experience (Years)</label>
                        <input
                          type="number"
                          name="experienceYears"
                          min="0"
                          className="form-control"
                          value={form.experienceYears}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Hourly Rate (₹)</label>
                        <input
                          type="number"
                          name="hourlyRate"
                          min="0"
                          className="form-control"
                          value={form.hourlyRate}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4 d-flex align-items-end">
                        <div className="form-check form-switch mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="availableSwitch"
                            name="available"
                            checked={form.available}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="availableSwitch">
                            Available for Bookings
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <button type="submit" className="btn btn-primary mt-4" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}