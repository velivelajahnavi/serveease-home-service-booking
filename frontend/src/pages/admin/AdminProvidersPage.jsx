import { useEffect, useState } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const emptyForm = {
  fullName: '',
  email: '',
  password: '',
  employeeCode: '',
  phone: '',
  specialization: '',
  experienceYears: 1,
  hourlyRate: 300,
  available: true,
};

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadProviders = () => {
    api
      .get('/admin/providers')
      .then((res) => setProviders(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const openCreate = () => {
    setEditingUserId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError('');
    setMessage('');
  };

  const openEdit = (p) => {
    setEditingUserId(p.userId);
    setForm({
      fullName: p.fullName || '',
      email: p.email || '',
      password: '',
      employeeCode: p.employeeCode || '',
      phone: p.phone || '',
      specialization: p.specialization || '',
      experienceYears: p.experienceYears ?? 0,
      hourlyRate: p.hourlyRate ?? 0,
      available: p.available ?? true,
    });
    setShowForm(true);
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const payload = {
      ...form,
      experienceYears: Number(form.experienceYears),
      hourlyRate: Number(form.hourlyRate),
    };
    try {
      if (editingUserId) {
        await api.put(`/admin/providers/${editingUserId}`, payload);
        setMessage('Provider updated successfully.');
      } else {
        await api.post('/admin/providers', payload);
        setMessage('Service provider created successfully.');
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingUserId(null);
      loadProviders();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save provider.');
    }
  };

  const toggleStatus = async (p) => {
    setError('');
    setMessage('');
    const nextStatus = p.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.patch(`/admin/users/${p.userId}/status`, { status: nextStatus });
      setMessage(`${p.fullName} marked as ${nextStatus}.`);
      loadProviders();
    } catch (err) {
      setError(err.response?.data?.error || 'Status update failed.');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Manage Service Providers</h3>
          <p className="text-muted mb-0">Create, edit, and control provider account status</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Provider
        </button>
      </div>

      {message && <div className="alert alert-success py-2 small">{message}</div>}
      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      {showForm && (
        <div className="card border-primary shadow-sm mb-4">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h6 className="mb-0">{editingUserId ? 'Edit Provider' : 'Create New Provider'}</h6>
            <button className="btn btn-sm btn-light" onClick={() => setShowForm(false)}>
              Close
            </button>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    disabled={Boolean(editingUserId)}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    Password {editingUserId ? '(leave blank to keep)' : '(default: Provider@123)'}
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Employee Code (auto if blank)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.employeeCode}
                    onChange={(e) => setForm({ ...form, employeeCode: e.target.value })}
                    disabled={Boolean(editingUserId)}
                    placeholder="PRV-1003"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Specialization</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    placeholder="Plumbing, Carpentry, Painting..."
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={form.experienceYears}
                    onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={form.hourlyRate}
                    onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
                  />
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <div className="form-check form-switch mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="provAvail"
                      checked={form.available}
                      onChange={(e) => setForm({ ...form, available: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="provAvail">
                      Available for Bookings
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-3 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingUserId ? 'Update Provider' : 'Create Provider'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Code</th>
                <th>Provider</th>
                <th>Specialization</th>
                <th>Exp / Rate</th>
                <th>Availability</th>
                <th>Account</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    No service providers found.
                  </td>
                </tr>
              ) : (
                providers.map((p) => (
                  <tr key={p.userId}>
                    <td className="fw-semibold">{p.employeeCode}</td>
                    <td>
                      <div className="fw-semibold">{p.fullName}</div>
                      <small className="text-muted">
                        {p.email} {p.phone ? `• ${p.phone}` : ''}
                      </small>
                    </td>
                    <td>{p.specialization || '—'}</td>
                    <td>
                      <div>{p.experienceYears} yrs</div>
                      <small className="text-muted">₹{p.hourlyRate}/hr</small>
                    </td>
                    <td>
                      <span className={`badge ${p.available ? 'bg-success' : 'bg-secondary'}`}>
                        {p.available ? 'Available' : 'Off-Duty'}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => openEdit(p)}
                        >
                          Edit
                        </button>
                        <button
                          className={`btn btn-sm ${
                            p.status === 'ACTIVE'
                              ? 'btn-outline-danger'
                              : 'btn-outline-success'
                          }`}
                          onClick={() => toggleStatus(p)}
                        >
                          {p.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}