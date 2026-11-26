import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function AdminDashboard() {
  const [report, setReport] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/admin/reports'), api.get('/admin/bookings')])
      .then(([repRes, bookRes]) => {
        setReport(repRes.data);
        setRecentBookings(bookRes.data.slice(0, 6));
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
          <h3 className="fw-bold mb-1">Admin Dashboard</h3>
          <p className="text-muted mb-0">Platform overview, users, services, and booking metrics</p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/admin/customers" className="btn btn-outline-primary btn-sm">
            Manage Customers
          </Link>
          <Link to="/admin/providers" className="btn btn-outline-primary btn-sm">
            Manage Providers
          </Link>
          <Link to="/admin/services" className="btn btn-primary btn-sm">
            Manage Services
          </Link>
        </div>
      </div>

      {/* KPI Row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-muted small">Customers</div>
              <div className="fs-3 fw-bold text-primary">{report?.totalCustomers ?? 0}</div>
              <small className="text-success">{report?.activeCustomers ?? 0} active</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-muted small">Service Providers</div>
              <div className="fs-3 fw-bold text-info">{report?.totalProviders ?? 0}</div>
              <small className="text-success">{report?.activeProviders ?? 0} active</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-muted small">Total Bookings</div>
              <div className="fs-3 fw-bold text-dark">{report?.totalBookings ?? 0}</div>
              <small className="text-muted">
                {report?.pendingBookings ?? 0} pending • {report?.completedBookings ?? 0} completed
              </small>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-muted small">Completed Revenue</div>
              <div className="fs-3 fw-bold text-success">
                ₹{report?.totalCompletedRevenue ?? 0}
              </div>
              <small className="text-muted">{report?.activeServices ?? 0} active services</small>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Latest Bookings Across Platform</h5>
          <Link to="/admin/bookings" className="btn btn-outline-primary btn-sm">
            View All Bookings
          </Link>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Code</th>
                <th>Service</th>
                <th>Customer</th>
                <th>Provider</th>
                <th>Date &amp; Slot</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    No bookings recorded yet.
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="fw-semibold">{b.bookingCode}</td>
                    <td>{b.serviceName}</td>
                    <td>{b.customerName}</td>
                    <td>{b.providerName}</td>
                    <td>
                      <div>{b.bookingDate}</div>
                      <small className="text-muted">{b.timeSlotLabel}</small>
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