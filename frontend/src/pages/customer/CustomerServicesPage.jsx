import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function CustomerServicesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [selectedService, setSelectedService] = useState(null);
  const [form, setForm] = useState({
    providerProfileId: '',
    bookingDate: '',
    timeSlot: '',
    serviceAddress: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  //const todayStr = new Date().toISOString().split('T')[0];
  const todayStr = new Date().toLocaleDateString('en-CA');

    const isSlotPassed = (slot, dateStr) => {
    if (dateStr !== todayStr) return false;
    const now = new Date();
    return slot.startHour <= now.getHours();
    };

  useEffect(() => {
    Promise.all([api.get('/customer/services'), api.get('/public/time-slots')])
      .then(([srvRes, slotRes]) => {
        setServices(srvRes.data);
        setTimeSlots(slotRes.data);
      })
      .finally(() => setLoading(false));
  }, []);


  const categories = ['ALL', ...new Set(services.map((s) => s.category))];
  const filteredServices =
    categoryFilter === 'ALL'
      ? services
      : services.filter((s) => s.category === categoryFilter);

  const openBookingForm = (service) => {
    const defaultProvider =
      service.assignedProviders?.find((p) => p.available) ||
      service.assignedProviders?.[0];
    const defaultAddress = [user?.address, user?.city].filter(Boolean).join(', ');
    const firstAvailableSlot = timeSlots.find((s) => !isSlotPassed(s, todayStr));

    setSelectedService(service);
    setError('');
    setSuccess('');
    setForm({
      providerProfileId: defaultProvider ? String(defaultProvider.providerProfileId) : '',
      bookingDate: todayStr,
      timeSlot: firstAvailableSlot ? firstAvailableSlot.code : '',
      serviceAddress: defaultAddress,
      notes: '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const payload = {
        serviceId: selectedService.id,
        providerProfileId: Number(form.providerProfileId),
        bookingDate: form.bookingDate,
        timeSlot: form.timeSlot,
        serviceAddress: form.serviceAddress,
        notes: form.notes,
      };
      const { data } = await api.post('/customer/bookings', payload);
      setSuccess(
        `Booking confirmed (${data.bookingCode}) for ${data.bookingDate} (${data.timeSlotLabel}).`
      );
      setSelectedService(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create booking.');
    } finally {
      setSubmitting(false);
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
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h3 className="fw-bold mb-1">Available Home Services</h3>
          <p className="text-muted mb-0">
            Working days: Monday to Saturday (Sundays are weekly holidays)
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${
                categoryFilter === cat ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {success && (
        <div className="alert alert-success d-flex justify-content-between align-items-center">
          <span>{success}</span>
          <button
            className="btn btn-sm btn-success"
            onClick={() => navigate('/customer/bookings')}
          >
            View My Bookings
          </button>
        </div>
      )}

      {/* Inline Booking Form */}
      {selectedService && (
        <div className="card border-primary shadow-sm mb-4">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              Book: {selectedService.serviceName} (₹{selectedService.basePrice})
            </h5>
            <button
              className="btn btn-sm btn-light"
              onClick={() => {
                setSelectedService(null);
                setError('');
              }}
            >
              Close
            </button>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            {!selectedService.assignedProviders ||
            selectedService.assignedProviders.length === 0 ? (
              <div className="alert alert-warning mb-0">
                No service providers are assigned to this service yet. Please check back later.
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Select Assigned Provider *</label>
                    <select
                      className="form-select"
                      value={form.providerProfileId}
                      onChange={(e) =>
                        setForm({ ...form, providerProfileId: e.target.value })
                      }
                      required
                    >
                      <option value="">-- Choose Provider --</option>
                      {selectedService.assignedProviders.map((p) => (
                        <option
                          key={p.providerProfileId}
                          value={p.providerProfileId}
                          disabled={!p.available}
                        >
                          {p.fullName} ({p.employeeCode}) — {p.experienceYears} yrs
                          {!p.available ? ' [Unavailable]' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Booking Date * (Mon–Sat)</label>
                    <input
                      type="date"
                      className="form-control"
                      min={todayStr}
                      value={form.bookingDate}
                      onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Time Slot *</label>
                    <select
                      className="form-select"
                      value={form.timeSlot}
                      onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                      required
                    >
                      <option value="">-- Choose Time Slot --</option>
                      {timeSlots.map((slot) => {
                        const passed = isSlotPassed(slot, form.bookingDate);
                        return (
                            <option key={slot.code} value={slot.code} disabled={passed}>
                        {slot.label}
                        {passed ? ' (Passed)' : ''}
                    </option>
                        
                      );
                    })}
                    </select>
                  </div>

                  <div className="col-md-7">
                    <label className="form-label">Service Address *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.serviceAddress}
                      onChange={(e) =>
                        setForm({ ...form, serviceAddress: e.target.value })
                      }
                      placeholder="Flat/House No, Street, Landmark, City"
                      required
                    />
                  </div>

                  <div className="col-md-5">
                    <label className="form-label">Notes (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Issue details or gate instructions"
                    />
                  </div>
                </div>

                <div className="mt-3 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setSelectedService(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="row g-4">
        {filteredServices.map((service) => (
          <div className="col-md-6 col-lg-4" key={service.id}>
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-info-subtle text-info-emphasis">
                    {service.category}
                  </span>
                  <small className="text-muted">{service.serviceCode}</small>
                </div>
                <h5 className="fw-bold">{service.serviceName}</h5>
                <p className="text-secondary small flex-grow-1">
                  {service.description || 'Doorstep home service by verified experts.'}
                </p>

                <div className="small text-muted mb-3">
                  <strong>Assigned Providers:</strong>{' '}
                  {service.assignedProviders?.length > 0
                    ? service.assignedProviders.map((p) => p.fullName).join(', ')
                    : 'None assigned'}
                </div>

                <div className="border-top pt-3 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fs-5 fw-bold text-primary">₹{service.basePrice}</span>
                    <small className="text-muted ms-2">{service.durationMins} mins</small>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => openBookingForm(service)}
                    disabled={!service.assignedProviders?.some((p) => p.available)}
                  >
                    Book Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}