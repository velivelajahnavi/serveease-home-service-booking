import { useEffect, useState } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchBookings = () => {
    api
      .get('/customer/bookings')
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    setMessage('');
    setError('');
    try {
      await api.patch(`/customer/bookings/${bookingId}/cancel`);
      setMessage('Booking cancelled successfully.');
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not cancel booking.');
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
      <h3 className="fw-bold mb-1">My Bookings</h3>
      <p className="text-muted mb-4">View assigned professionals, schedule, and booking status</p>

      {message && <div className="alert alert-success py-2 small">{message}</div>}
      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Code</th>
                <th>Service</th>
                <th>Assigned Provider</th>
                <th>Date &amp; Slot</th>
                <th>Address</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">
                    You have not placed any bookings yet.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="fw-semibold">{b.bookingCode}</td>
                    <td>
                      <div className="fw-semibold">{b.serviceName}</div>
                      <small className="text-muted">{b.category}</small>
                    </td>
                    <td>
                      <div>{b.providerName}</div>
                      <small className="text-muted">
                        {b.providerCode} {b.providerPhone ? `• ${b.providerPhone}` : ''}
                      </small>
                    </td>
                    <td>
                      <div>{b.bookingDate}</div>
                      <small className="text-muted">{b.timeSlotLabel}</small>
                    </td>
                    <td className="small" style={{ maxWidth: '200px' }}>
                      {b.serviceAddress}
                    </td>
                    <td className="fw-semibold">₹{b.totalPrice}</td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td>
                      {b.status !== 'COMPLETED' && b.status !== 'CANCELLED' ? (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleCancel(b.id)}
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
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