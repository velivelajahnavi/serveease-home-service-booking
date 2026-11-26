import { useEffect, useState } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .get('/admin/bookings')
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      b.bookingCode.toLowerCase().includes(q) ||
      b.serviceName.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      b.providerName.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div>
          <h3 className="fw-bold mb-1">All Platform Bookings</h3>
          <p className="text-muted mb-0">Monitor every customer-provider booking and status</p>
        </div>
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: '280px' }}
          placeholder="Search code, customer, provider..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="d-flex flex-wrap gap-1 mb-3">
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

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Code</th>
                <th>Service</th>
                <th>Customer</th>
                <th>Provider</th>
                <th>Date &amp; Slot</th>
                <th>Address</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">
                    No matching bookings found.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id}>
                    <td className="fw-semibold">{b.bookingCode}</td>
                    <td>
                      <div>{b.serviceName}</div>
                      <small className="text-muted">{b.category}</small>
                    </td>
                    <td>
                      <div>{b.customerName}</div>
                      <small className="text-muted">{b.customerEmail}</small>
                    </td>
                    <td>
                      <div>{b.providerName}</div>
                      <small className="text-muted">{b.providerCode}</small>
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