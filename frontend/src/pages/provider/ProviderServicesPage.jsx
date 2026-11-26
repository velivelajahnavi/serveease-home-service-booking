import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function ProviderServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/provider/services')
      .then((res) => setServices(res.data))
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
      <h3 className="fw-bold mb-1">My Assigned Services</h3>
      <p className="text-muted mb-4">
        Services assigned to your profile by the administrator
      </p>

      {services.length === 0 ? (
        <div className="alert alert-info">
          No services have been assigned to you yet. Contact admin.
        </div>
      ) : (
        <div className="row g-4">
          {services.map((s) => (
            <div className="col-md-6 col-lg-4" key={s.id}>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="badge bg-info-subtle text-info-emphasis">{s.category}</span>
                    <small className="text-muted">{s.serviceCode}</small>
                  </div>
                  <h5 className="fw-bold">{s.serviceName}</h5>
                  <p className="text-secondary small">{s.description}</p>
                  <div className="border-top pt-2 d-flex justify-content-between">
                    <span className="fw-bold text-primary">₹{s.basePrice}</span>
                    <span className="text-muted small">{s.durationMins} mins</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}