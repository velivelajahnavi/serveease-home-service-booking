import { useEffect, useState } from 'react';
import api from '../../services/api';

const emptyService = {
  serviceName: '',
  serviceCode: '',
  category: '',
  description: '',
  basePrice: 499,
  durationMins: 60,
  active: true,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyService);

  const [assignSelection, setAssignSelection] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = () => {
    Promise.all([api.get('/admin/services'), api.get('/admin/providers')])
      .then(([srvRes, provRes]) => {
        setServices(srvRes.data);
        setProviders(provRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyService);
    setShowForm(true);
    setError('');
    setMessage('');
  };

  const openEdit = (s) => {
    setEditingId(s.id);
    setForm({
      serviceName: s.serviceName,
      serviceCode: s.serviceCode,
      category: s.category,
      description: s.description || '',
      basePrice: s.basePrice,
      durationMins: s.durationMins,
      active: s.active,
    });
    setShowForm(true);
    setError('');
    setMessage('');
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const payload = {
      ...form,
      basePrice: Number(form.basePrice),
      durationMins: Number(form.durationMins),
    };
    try {
      if (editingId) {
        await api.put(`/admin/services/${editingId}`, payload);
        setMessage('Service updated successfully.');
      } else {
        await api.post('/admin/services', payload);
        setMessage('New service created successfully.');
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyService);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save service.');
    }
  };

  const handleAssign = async (serviceId) => {
    const providerProfileId = assignSelection[serviceId];
    if (!providerProfileId) return;
    setError('');
    setMessage('');
    try {
      await api.post('/admin/services/assign', {
        serviceId,
        providerProfileId: Number(providerProfileId),
      });
      setMessage('Provider assigned to service.');
      setAssignSelection((prev) => ({ ...prev, [serviceId]: '' }));
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Assignment failed.');
    }
  };

  const handleUnassign = async (serviceId, providerProfileId) => {
    setError('');
    setMessage('');
    try {
      await api.delete(`/admin/services/${serviceId}/providers/${providerProfileId}`);
      setMessage('Provider unassigned from service.');
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not unassign provider.');
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
          <h3 className="fw-bold mb-1">Manage Services &amp; Assignments</h3>
          <p className="text-muted mb-0">Create home services and assign verified providers</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Service
        </button>
      </div>

      {message && <div className="alert alert-success py-2 small">{message}</div>}
      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      {showForm && (
        <div className="card border-primary shadow-sm mb-4">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h6 className="mb-0">{editingId ? 'Edit Service' : 'Create New Service'}</h6>
            <button className="btn btn-sm btn-light" onClick={() => setShowForm(false)}>
              Close
            </button>
          </div>
          <div className="card-body">
            <form onSubmit={handleSaveService}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Service Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.serviceName}
                    onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Service Code *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.serviceCode}
                    onChange={(e) => setForm({ ...form, serviceCode: e.target.value })}
                    disabled={Boolean(editingId)}
                    placeholder="SRV-CRP-01"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Category *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Plumbing / Electrical / Cleaning"
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Base Price (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={form.basePrice}
                    onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Duration (mins) *</label>
                  <input
                    type="number"
                    min="15"
                    className="form-control"
                    value={form.durationMins}
                    onChange={(e) => setForm({ ...form, durationMins: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="srvActive"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="srvActive">
                      Service Active in Catalog
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
                  {editingId ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="row g-4">
        {services.map((s) => {
          const assignedIds = new Set(s.assignedProviders.map((p) => p.providerProfileId));
          const unassignedProviders = providers.filter(
            (p) => p.profileId && !assignedIds.has(p.profileId)
          );

          return (
            <div className="col-lg-6" key={s.id}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge bg-info-subtle text-info-emphasis me-2">
                        {s.category}
                      </span>
                      <span className={`badge ${s.active ? 'bg-success' : 'bg-secondary'}`}>
                        {s.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => openEdit(s)}
                    >
                      Edit
                    </button>
                  </div>

                  <h5 className="fw-bold mb-1">
                    {s.serviceName}{' '}
                    <small className="text-muted fw-normal">({s.serviceCode})</small>
                  </h5>
                  <p className="text-secondary small mb-2">{s.description || '—'}</p>
                  <div className="small mb-3">
                    <strong className="text-primary">₹{s.basePrice}</strong> • {s.durationMins} mins
                  </div>

                  <div className="border-top pt-3">
                    <div className="small fw-semibold mb-2">Assigned Providers:</div>
                    {s.assignedProviders.length === 0 ? (
                      <div className="text-muted small mb-2">None assigned yet.</div>
                    ) : (
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {s.assignedProviders.map((p) => (
                          <span
                            key={p.providerProfileId}
                            className="badge bg-light text-dark border d-inline-flex align-items-center gap-2 py-2 px-2"
                          >
                            {p.fullName} ({p.employeeCode})
                            <button
                              type="button"
                              className="btn-close"
                              style={{ fontSize: '0.6rem' }}
                              aria-label="Unassign"
                              onClick={() => handleUnassign(s.id, p.providerProfileId)}
                            />
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="input-group input-group-sm">
                      <select
                        className="form-select"
                        value={assignSelection[s.id] || ''}
                        onChange={(e) =>
                          setAssignSelection({ ...assignSelection, [s.id]: e.target.value })
                        }
                      >
                        <option value="">-- Assign a provider --</option>
                        {unassignedProviders.map((p) => (
                          <option key={p.profileId} value={p.profileId}>
                            {p.fullName} ({p.employeeCode}) — {p.specialization || 'General'}
                          </option>
                        ))}
                      </select>
                      <button
                        className="btn btn-outline-primary"
                        type="button"
                        disabled={!assignSelection[s.id]}
                        onClick={() => handleAssign(s.id)}
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}