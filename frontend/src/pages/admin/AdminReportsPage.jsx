import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/reports')
      .then((res) => setReport(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  const totalBookings = report?.totalBookings || 0;
  const pct = (count) => (totalBookings > 0 ? Math.round((count / totalBookings) * 100) : 0);

  const statusRows = [
    { label: 'Pending', count: report?.pendingBookings ?? 0, color: 'bg-warning' },
    { label: 'Confirmed', count: report?.confirmedBookings ?? 0, color: 'bg-info' },
    { label: 'In Progress', count: report?.inProgressBookings ?? 0, color: 'bg-primary' },
    { label: 'Completed', count: report?.completedBookings ?? 0, color: 'bg-success' },
    { label: 'Cancelled', count: report?.cancelledBookings ?? 0, color: 'bg-secondary' },
  ];

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-1">Reports &amp; Statistics</h3>
      <p className="text-muted mb-4">Live summary across accounts, services, and booking revenue</p>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">User Accounts</h6>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span>Total Customers</span>
                <strong>
                  {report.activeCustomers} / {report.totalCustomers} active
                </strong>
              </div>
              <div className="d-flex justify-content-between py-2">
                <span>Total Service Providers</span>
                <strong>
                  {report.activeProviders} / {report.totalProviders} active
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Service Catalog</h6>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span>Total Services</span>
                <strong>{report.totalServices}</strong>
              </div>
              <div className="d-flex justify-content-between py-2">
                <span>Active Services</span>
                <strong className="text-success">{report.activeServices}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Revenue Summary</h6>
              <div className="fs-2 fw-bold text-success mt-2">
                ₹{report.totalCompletedRevenue}
              </div>
              <small className="text-muted">
                From {report.completedBookings} completed service booking(s)
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Status Breakdown */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-bold">Booking Status Distribution ({totalBookings} Total)</h5>
        </div>
        <div className="card-body">
          {statusRows.map((row) => (
            <div className="mb-3" key={row.label}>
              <div className="d-flex justify-content-between small mb-1">
                <span className="fw-semibold">{row.label}</span>
                <span>
                  {row.count} ({pct(row.count)}%)
                </span>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div
                  className={`progress-bar ${row.color}`}
                  style={{ width: `${pct(row.count)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}