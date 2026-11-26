import { useEffect, useState } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function ProviderBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchBookings = () => {
    api
      .get('/provider/bookings')
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (bookingId, newStatus) => {
    setMessage('');
    setError('');
    try {
      await api.patch(`/provider/bookings/${bookingId}/status`, { status: newStatus });
      setMessage(`Booking updated to ${newStatus.replace('_', ' ')}.`);
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.error || 'Status update failed.');
    }
  };

  const filtered =
    statusFilter === 'ALL'
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

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
          <h3 className="fw-bold mb-1">Assigned Customer Bookings</h3>
          <p className="text-muted mb-0">Confirm, start, or complete jobs assigned to you</p>
        </div>

        <div className="d-flex flex-wrap gap-1">
          {['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              className={`btn btn-sm ${
                statusFilter === st ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              onClick={() => setStatusFilter(st)}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {message && <div className="alert alert-success py-2 small">{message}</div>}
      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Code</th>
                <th>Service</th>
                <th>Customer</th>
                <th>Date &amp; Slot</th>
                <th>Address &amp; Notes</th>
                <th>Price</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">
                    No bookings found for this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id}>
                    <td className="fw-semibold">{b.bookingCode}</td>
                    <td>{b.serviceName}</td>
                    <td>
                      <div className="fw-semibold">{b.customerName}</div>
                      <small className="text-muted">{b.customerPhone || b.customerEmail}</small>
                    </td>
                    <td>
                      <div>{b.bookingDate}</div>
                      <small className="text-muted">{b.timeSlotLabel}</small>
                    </td>
                    <td className="small" style={{ maxWidth: '210px' }}>
                      <div>{b.serviceAddress}</div>
                      {b.notes && <div className="text-muted fst-italic">Note: {b.notes}</div>}
                    </td>
                    <td className="fw-semibold">₹{b.totalPrice}</td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {b.status === 'PENDING' && (
                          <>
                            <button
                              className="btn btn-sm btn-info text-dark"
                              onClick={() => updateStatus(b.id, 'CONFIRMED')}
                            >
                              Confirm
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => updateStatus(b.id, 'CANCELLED')}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {b.status === 'CONFIRMED' && (
                          <>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => updateStatus(b.id, 'IN_PROGRESS')}
                            >
                              Start Job
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => updateStatus(b.id, 'CANCELLED')}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {b.status === 'IN_PROGRESS' && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => updateStatus(b.id, 'COMPLETED')}
                          >
                            Complete
                          </button>
                        )}
                        {(b.status === 'COMPLETED' || b.status === 'CANCELLED') && (
                          <span className="text-muted small">—</span>
                        )}
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