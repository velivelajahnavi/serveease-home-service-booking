// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark se-navbar sticky-top py-2">
//       <div className="container">
//         <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-5" to="/">
//           <span className="se-brand-icon">S</span>
//           <span>ServeEase</span>
//         </Link>

//         <button
//           className="navbar-toggler border-0"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#mainNavbar"
//         >
//           <span className="navbar-toggler-icon" />
//         </button>

//         <div className="collapse navbar-collapse" id="mainNavbar">
//           <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-1 ms-lg-3">
//             {!user && (
//               <>
//                 <li className="nav-item">
//                   <NavLink className="nav-link" to="/">Home</NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/#services">Services</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/#about">About Us</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/#help">Help</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/#contact">Contact</Link>
//                 </li>
//               </>
//             )}

//             {user?.role === 'ADMIN' && (
//               <>
//                 <li className="nav-item">
//                   <NavLink className="nav-link" to="/admin/dashboard">Dashboard</NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink className="nav-link" to="/admin/customers">Customers</NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink className="nav-link" to="/admin/providers">Providers</NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink className="nav-link" to="/admin/services">Services</NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink className="nav-link" to="/admin/bookings">Bookings</NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink className="nav-link" to="/admin/reports">Reports</NavLink>
//                 </li>
//               </>
//             )}

//             {user?.role === 'CUSTOMER' && (
//               <>
//                 <li className="nav-item">
//                   <NavLink className="nav-link" to="/customer/dashboard">Dashboard</NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink className="nav-link" to="/customer/services">Services</NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink className="nav-link" to="/customer/bookings">My Bookings</NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/#help">Help</Link>
//                 </li>
//               </>
//             )}

//             {user?.role === 'PROVIDER' && (
//               <>
//                 <li className="nav-item">
//                   <NavLink className="nav-link" to="/provider/dashboard">Dashboard</NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink className="nav-link" to="/provider/services">Assigned Services</NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink className="nav-link" to="/provider/bookings">Bookings</NavLink>
//                 </li>
//               </>
//             )}

//             {user && (
//               <li className="nav-item">
//                 <NavLink className="nav-link" to="/profile">Profile</NavLink>
//               </li>
//             )}
//           </ul>

//           <div className="d-flex align-items-center gap-2">
//             {user ? (
//               <>
//                 <div className="d-flex align-items-center gap-2 bg-white bg-opacity-10 px-3 py-1 rounded-pill">
//                   <span className="text-white small fw-medium">{user.fullName}</span>
//                   <span className="badge rounded-pill bg-info text-dark" style={{ fontSize: '0.7rem' }}>
//                     {user.role}
//                   </span>
//                 </div>
//                 <button className="btn btn-outline-light btn-sm px-3 rounded-pill" onClick={handleLogout}>
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link className="btn btn-outline-light btn-sm px-3 rounded-pill" to="/login">
//                   Login
//                 </Link>
//                 <Link className="btn btn-primary btn-sm px-3 rounded-pill" to="/register">
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }


import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = () => {
    setShowProfileModal(false);
    logout();
    navigate('/login');
  };

  const handleEditProfile = () => {
    setShowProfileModal(false);
    navigate('/profile');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark se-navbar sticky-top py-2">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-5" to="/">
            <span className="se-brand-icon">S</span>
            <span>ServeEase</span>
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-1 ms-lg-3">
              {!user && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/">Home</NavLink>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/#services">Services</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/#about">About Us</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/#help">Help</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/#contact">Contact</Link>
                  </li>
                </>
              )}

              {user?.role === 'ADMIN' && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/dashboard">Dashboard</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/customers">Customers</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/providers">Providers</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/services">Services</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/bookings">Bookings</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/reports">Reports</NavLink>
                  </li>
                </>
              )}

              {user?.role === 'CUSTOMER' && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/customer/dashboard">Dashboard</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/customer/services">Services</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/customer/bookings">My Bookings</NavLink>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/#help">Help</Link>
                  </li>
                </>
              )}

              {user?.role === 'PROVIDER' && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/provider/dashboard">Dashboard</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/provider/services">Assigned Services</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/provider/bookings">Bookings</NavLink>
                  </li>
                </>
              )}
            </ul>

            <div className="d-flex align-items-center gap-2">
              {user ? (
                <button
                  type="button"
                  className="se-profile-trigger"
                  onClick={() => setShowProfileModal(true)}
                  title="View Profile"
                >
                  <span className="se-profile-trigger-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </span>
                  <span className="fw-medium">{user.fullName}</span>
                </button>
              ) : (
                <>
                  <Link className="btn btn-outline-light btn-sm px-3 rounded-pill" to="/login">
                    Login
                  </Link>
                  <Link className="btn btn-primary btn-sm px-3 rounded-pill" to="/register">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Centered Profile Popup Modal */}
      {user && showProfileModal && (
        <div
          className="se-modal-backdrop"
          onClick={() => setShowProfileModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="se-profile-modal shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="btn-close se-modal-close"
              aria-label="Close"
              onClick={() => setShowProfileModal(false)}
            />

            <div className="text-center">
              <div className="se-avatar-circle mx-auto mb-2">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>

              <h5 className="fw-bold text-primary mb-1">My Profile</h5>
              <span className="badge rounded-pill bg-primary-subtle text-primary mb-3 px-3 py-1">
                {user.role}
              </span>

              <div className="mb-3">
                <div className="small fw-bold text-dark">Name:</div>
                <div className="text-secondary">{user.fullName}</div>
              </div>

              <div className="mb-3">
                <div className="small fw-bold text-dark">Email:</div>
                <div className="text-secondary">{user.email}</div>
              </div>

              {user.phone && (
                <div className="mb-3">
                  <div className="small fw-bold text-dark">Phone:</div>
                  <div className="text-secondary">{user.phone}</div>
                </div>
              )}

              {user.employeeCode && (
                <div className="mb-3">
                  <div className="small fw-bold text-dark">Employee Code:</div>
                  <div className="text-secondary">{user.employeeCode}</div>
                </div>
              )}

              <div className="d-flex justify-content-center gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-primary px-3"
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-4"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}