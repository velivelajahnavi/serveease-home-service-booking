import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getHomeRouteForRole, useAuth } from '../context/AuthContext';

export default function OAuth2CallbackPage() {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    loginWithToken(token).then((profile) => {
      if (profile?.role) {
        navigate(getHomeRouteForRole(profile.role), { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    });
  }, [searchParams, loginWithToken, navigate]);

  return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary mb-3" role="status" />
      <p className="text-muted">Completing Google Sign-In...</p>
    </div>
  );
}