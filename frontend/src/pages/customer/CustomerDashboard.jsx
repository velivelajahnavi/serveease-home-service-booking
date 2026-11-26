import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/customer/stats'), api.get('/customer/bookings')])
      .then(([statsRes, bookingsRes]) => {
        setStats(statsRes.data);
        setRecentBookings(bookingsRes.data.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

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
          <h3 className="fw-bold mb-1">Welcome, {user?.fullName}</h3>
          <p className="text-muted mb-0">Track your home service bookings and schedule new visits</p>
        </div>
        <Link to="/customer/services" className="btn btn-primary">
          + Book a Service
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="text-muted small">Total Bookings</div>
              <div className="fs-3 fw-bold text-primary">{stats?.totalBookings ?? 0}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="text-muted small">Pending</div>
              <div className="fs-3 fw-bold text-warning">{stats?.pendingBookings ?? 0}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="text-muted small">Confirmed</div>
              <div className="fs-3 fw-bold text-info">{stats?.confirmedBookings ?? 0}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="text-muted small">Completed</div>
              <div className="fs-3 fw-bold text-success">{stats?.completedBookings ?? 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Recent Bookings</h5>
          <Link to="/customer/bookings" className="btn btn-outline-primary btn-sm">
            View All
          </Link>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Code</th>
                <th>Service</th>
                <th>Provider</th>
                <th>Date &amp; Slot</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No bookings yet. Browse services to book your first visit.
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="fw-semibold">{b.bookingCode}</td>
                    <td>{b.serviceName}</td>
                    <td>{b.providerName}</td>
                    <td>
                      <div>{b.bookingDate}</div>
                      <small className="text-muted">{b.timeSlotLabel}</small>
                    </td>
                    <td>₹{b.totalPrice}</td>
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