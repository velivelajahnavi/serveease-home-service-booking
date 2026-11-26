import { useEffect, useState } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const emptyForm = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  address: '',
  city: '',
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadCustomers = () => {
    api
      .get('/admin/customers')
      .then((res) => setCustomers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const openCreate = () => {
    setEditingUserId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError('');
    setMessage('');
  };

  const openEdit = (c) => {
    setEditingUserId(c.userId);
    setForm({
      fullName: c.fullName || '',
      email: c.email || '',
      password: '',
      phone: c.phone || '',
      address: c.address || '',
      city: c.city || '',
    });
    setShowForm(true);
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      if (editingUserId) {
        await api.put(`/admin/customers/${editingUserId}`, form);
        setMessage('Customer updated successfully.');
      } else {
        await api.post('/admin/customers', form);
        setMessage('Customer account created successfully.');
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingUserId(null);
      loadCustomers();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save customer.');
    }
  };

  const toggleStatus = async (c) => {
    setError('');
    setMessage('');
    const nextStatus = c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.patch(`/admin/users/${c.userId}/status`, { status: nextStatus });
      setMessage(`${c.fullName} marked as ${nextStatus}.`);
      loadCustomers();
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
          <h3 className="fw-bold mb-1">Manage Customers</h3>
          <p className="text-muted mb-0">Create, update, and activate or deactivate customer accounts</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Customer
        </button>
      </div>

      {message && <div className="alert alert-success py-2 small">{message}</div>}
      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      {showForm && (
        <div className="card border-primary shadow-sm mb-4">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h6 className="mb-0">{editingUserId ? 'Edit Customer' : 'Create New Customer'}</h6>
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
                    Password {editingUserId ? '(leave blank to keep)' : '(default: Customer@123)'}
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
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
                  {editingUserId ? 'Update Customer' : 'Create Customer'}
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
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City / Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.userId}>
                    <td className="fw-semibold">{c.fullName}</td>
                    <td>{c.email}</td>
                    <td>{c.phone || '—'}</td>
                    <td className="small">
                      {[c.address, c.city].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => openEdit(c)}
                        >
                          Edit
                        </button>
                        <button
                          className={`btn btn-sm ${
                            c.status === 'ACTIVE'
                              ? 'btn-outline-danger'
                              : 'btn-outline-success'
                          }`}
                          onClick={() => toggleStatus(c)}
                        >
                          {c.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
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