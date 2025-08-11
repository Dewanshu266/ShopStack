import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {

  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(m => !m);

  // Theme toggle
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.style.setProperty('--ocean-breeze-bg', '#1a232a');
      document.documentElement.style.setProperty('--ocean-breeze-bg-dark', '#16202a');
      document.documentElement.style.setProperty('--ocean-breeze-primary', '#0288d1');
      document.documentElement.style.setProperty('--ocean-breeze-primary-dark', '#01579b');
      document.documentElement.style.setProperty('--ocean-breeze-accent', '#4dd0e1');
      document.documentElement.style.setProperty('--ocean-breeze-accent-dark', '#0097a7');
      document.documentElement.style.setProperty('--ocean-breeze-text', '#e0f7fa');
      document.documentElement.style.setProperty('--ocean-breeze-text-light', '#ffffff');
      document.documentElement.style.setProperty('--ocean-breeze-border', '#263238');
      document.documentElement.style.setProperty('--ocean-breeze-card', '#22313a');
    } else {
      document.documentElement.style.setProperty('--ocean-breeze-bg', '#e0f7fa');
      document.documentElement.style.setProperty('--ocean-breeze-bg-dark', '#b2ebf2');
      document.documentElement.style.setProperty('--ocean-breeze-primary', '#0288d1');
      document.documentElement.style.setProperty('--ocean-breeze-primary-dark', '#01579b');
      document.documentElement.style.setProperty('--ocean-breeze-accent', '#4dd0e1');
      document.documentElement.style.setProperty('--ocean-breeze-accent-dark', '#0097a7');
      document.documentElement.style.setProperty('--ocean-breeze-text', '#013243');
      document.documentElement.style.setProperty('--ocean-breeze-text-light', '#ffffff');
      document.documentElement.style.setProperty('--ocean-breeze-border', '#b2ebf2');
      document.documentElement.style.setProperty('--ocean-breeze-card', '#ffffffcc');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <header style={{ width: '100vw', left: 0, top: 0, background: 'var(--ocean-breeze-primary)', borderBottom: '1px solid var(--ocean-breeze-border)', position: 'fixed', zIndex: 100, boxShadow: 'var(--ocean-breeze-shadow)' }}>
  <nav style={{ width: '100%', maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '12px 32px', minHeight: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 32 }}>
          <Link to="/" style={{ fontWeight: 'bold', fontSize: 24, textDecoration: 'none', color: 'var(--ocean-breeze-text-light)', letterSpacing: 1 }}>ShopStack</Link>
        </div>
        <button className="navbar-toggle" onClick={toggleMenu} style={{ display: 'none', background: 'none', border: 'none', fontSize: 28, cursor: 'pointer' }}>
          ☰
        </button>
        <div className={`navbar-links${menuOpen ? ' open' : ''}`} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          minWidth: 320,
          padding: '8px 0 8px 0',
          whiteSpace: 'normal',
          flex: 1
        }}>
          <Link to="/" style={{ marginRight: 8, color: 'var(--ocean-breeze-text-light)' }}>Home</Link>
          {!isAdmin && <>
            <Link to="/cart" style={{ marginRight: 8, color: 'var(--ocean-breeze-text-light)' }}>Cart</Link>
            <Link to="/wishlist" style={{ marginRight: 8, color: 'var(--ocean-breeze-text-light)' }}>Wishlist</Link>
          </>}
          <Link to="/orders" style={{ marginRight: 8, color: 'var(--ocean-breeze-text-light)' }}>Orders</Link>
          <Link to="/addresses" style={{ marginRight: 8, color: 'var(--ocean-breeze-text-light)' }}>Addresses</Link>
          {isAdmin && <>
            <Link to="/admin" style={{ marginRight: 8, color: 'var(--ocean-breeze-text-light)' }}>Admin</Link>
            <Link to="/admin/products" style={{ marginRight: 8, color: 'var(--ocean-breeze-text-light)' }}>Manage Products</Link>
          </>}
          {!isAuthenticated ? (
            <>
              <Link to="/login" style={{ marginRight: 8, color: 'var(--ocean-breeze-text-light)' }}>Login</Link>
              <Link to="/register" style={{ color: 'var(--ocean-breeze-text-light)' }}>Register</Link>
            </>
          ) : (
            <Link to="/profile" style={{ marginLeft: 8, color: 'var(--ocean-breeze-text-light)' }}>Profile</Link>
          )}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <button onClick={toggleTheme} style={{
            background: 'var(--ocean-breeze-accent-dark)',
            color: 'var(--ocean-breeze-text-light)',
            border: 'none',
            borderRadius: 20,
            padding: '6px 18px',
            fontWeight: 600,
            fontSize: 16,
            marginLeft: 16,
            cursor: 'pointer',
            boxShadow: 'var(--ocean-breeze-shadow)'
          }}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </nav>
      <style>{`
        @media (max-width: 900px) {
          .navbar-links {
            flex-wrap: wrap;
            justify-content: flex-end;
            gap: 12px;
          }
        }
        @media (max-width: 768px) {
          .navbar-links {
            display: ${menuOpen ? 'flex' : 'none'};
            flex-direction: column;
            background: var(--ocean-breeze-primary);
            position: absolute;
            top: 60px;
            left: 0;
            width: 100vw;
            padding: 16px 0;
            gap: 16px;
            z-index: 1000;
          }
          .navbar-toggle {
            display: block;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
