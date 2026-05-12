import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/AppLayout.css';

const customerNavItems = [
  { to: '/home', icon: '🏠', label: 'Home' },
  { to: '/chat', icon: '💬', label: 'Chat' },
  { to: '/therapist-info', icon: '🌿', label: 'Therapist' },
  { to: '/profile', icon: '👤', label: 'Profile' },
];

const therapistNavItems = [
  { to: '/therapist', icon: '🏠', label: 'Home' },
  { to: '/profile', icon: '👤', label: 'Profile' },
];

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

export default function AppLayout({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const navItems = user?.role === 'therapist' ? therapistNavItems : customerNavItems;

  return (
    <div className="app-shell">
      {/* Top bar */}
      <header className="top-bar">
        <div className="top-bar-logo">🌿 <span>Serene</span></div>
        <div className="top-bar-right">
          <div className="top-bar-greeting">Hi, {user?.name?.split(' ')[0]}</div>
          <button className="avatar top-bar-avatar" onClick={handleLogout} title="Logout">
            {user?.name?.[0]?.toUpperCase()}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="app-main">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="bottom-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
