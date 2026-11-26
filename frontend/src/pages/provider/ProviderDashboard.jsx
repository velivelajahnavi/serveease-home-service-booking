import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';

export default function ProviderDashboard() {
  const { user, refreshProfile } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const loadData = () => {
    Promise.all([api.get('/provider/stats'), api.get('/provider/bookings')])
      .then(([statsRes, bookingsRes]) => {
        setStats(statsRes.data);
        setRecentBookings(bookingsRes.data.slice(0, 5));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleAvailability = async () => {
    if (!stats) return;
    setToggling(true);
    try {
      await api.patch('/provider/availability', { available: !stats.available });
      await refreshProfile();
      loadData();
    } finally {
      setToggling(false);
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
          <h3 className="fw-bold mb-1">Provider Dashboard — {user?.fullName}</h3>
          <p className="text-muted mb-0">
            Code: <strong>{user?.employeeCode}</strong> • Specialization: {user?.specialization || 'General'}
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className={`badge fs-6 ${stats?.available ? 'bg-success' : 'bg-secondary'}`}>
            {stats?.available ? 'Available Today' : 'Unavailable'}
          </span>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={handleToggleAvailability}
            disabled={toggling}
          >
            {stats?.available ? 'Mark Unavailable' : 'Mark Available'}
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="text-muted small">Assigned Services</div>
              <div className="fs-3 fw-bold text-primary">{stats?.assignedServicesCount ?? 0}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="text-muted small">Pending Jobs</div>
              <div className="fs-3 fw-bold text-warning">{stats?.pendingBookings ?? 0}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="text-muted small">Completed Jobs</div>
              <div className="fs-3 fw-bold text-success">{stats?.completedBookings ?? 0}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="text-muted small">Completed Revenue</div>
              <div className="fs-3 fw-bold text-dark">₹{stats?.totalCompletedRevenue ?? 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Assigned Bookings */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Upcoming &amp; Recent Jobs</h5>
          <Link to="/provider/bookings" className="btn btn-outline-primary btn-sm">
            Manage All Bookings
          </Link>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Code</th>
                <th>Service</th>
                <th>Customer</th>
                <th>Date &amp; Slot</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No customer bookings assigned yet.
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="fw-semibold">{b.bookingCode}</td>
                    <td>{b.serviceName}</td>
                    <td>
                      <div>{b.customerName}</div>
                      <small className="text-muted">{b.customerPhone || b.customerEmail}</small>
                    </td>
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