import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '⚡' },
  { path: '/workouts', label: 'Workouts', icon: '🏋️' },
  { path: '/nutrition', label: 'Nutrition', icon: '🥗' },
  { path: '/progress', label: 'Progress', icon: '📈' },
  { path: '/goals', label: 'Goals', icon: '🎯' },
  { path: '/community', label: 'Community', icon: '💬' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

export default function Navbar() {
  const { currentUser, logout, darkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar navbar-expand-lg ft-navbar sticky-top">
      <div className="container-fluid px-3">

        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2 text-decoration-none" to="/">
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99,102,241,0.4)'
          }}>
            <span style={{ fontSize: 18 }}>💪</span>
          </div>
          <span className="fw-800" style={{ fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            FitTrack
          </span>
        </Link>

        <button className="navbar-toggler border-0 shadow-none" onClick={() => setOpen(!open)}>
          <span style={{ fontSize: 22 }}>{open ? '✕' : '☰'}</span>
        </button>

        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          {/* Nav links */}
          {currentUser && (
            <ul className="navbar-nav mx-auto d-flex gap-1 flex-wrap">
              {navItems.map(item => (
                <li key={item.path} className="nav-item">
                  <Link
                    className={`nav-link d-flex align-items-center gap-1 ${location.pathname === item.path ? 'active' : ''}`}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    style={{ fontSize: '0.85rem' }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Right side */}
          <div className="d-flex align-items-center gap-2 ms-auto mt-2 mt-lg-0">
            {/* Dark mode */}
            <button
              onClick={toggleDarkMode}
              className="btn btn-sm border-0 rounded-circle"
              style={{
                width: 36, height: 36,
                background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.1)',
                fontSize: 16,
              }}
              title="Toggle theme"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {currentUser ? (
              <div className="d-flex align-items-center gap-2">
                <div
                  style={{
                    width: 34, height: 34,
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                    boxShadow: '0 2px 10px rgba(99,102,241,0.4)'
                  }}
                >
                  {currentUser.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: darkMode ? '#94a3b8' : '#64748b' }}>
                  {currentUser}
                </span>
                <button
                  className="btn btn-sm"
                  onClick={handleLogout}
                  style={{
                    borderRadius: 10,
                    background: 'rgba(239,68,68,0.1)',
                    color: '#ef4444',
                    border: '1px solid rgba(239,68,68,0.2)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    padding: '0.3rem 0.75rem'
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm" style={{ borderRadius: 10, border: '1.5px solid #6366f1', color: '#6366f1', fontWeight: 600, padding: '0.3rem 0.9rem' }}>
                  Login
                </Link>
                <Link to="/signup" className="btn btn-sm btn-gradient-primary" style={{ padding: '0.35rem 1rem' }}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
