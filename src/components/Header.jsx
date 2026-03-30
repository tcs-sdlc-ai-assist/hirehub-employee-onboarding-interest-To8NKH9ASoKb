import { useState, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { isLoggedIn, logout } from '../utils/session.js';
import './Header.css';

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(() => isLoggedIn());
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Re-check session state on each render
  const currentLoginState = isLoggedIn();
  if (currentLoginState !== loggedIn) {
    setLoggedIn(currentLoginState);
  }

  const handleLogout = useCallback(() => {
    logout();
    setLoggedIn(false);
    setMenuOpen(false);
    navigate('/');
  }, [navigate]);

  const handleLogin = useCallback(() => {
    setMenuOpen(false);
    navigate('/admin');
  }, [navigate]);

  const handleToggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleNavClick = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <NavLink to="/" className="header-brand" onClick={handleNavClick}>
          HireHub
        </NavLink>

        <button
          className="header-menu-toggle"
          onClick={handleToggleMenu}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={`header-nav${menuOpen ? ' header-nav-open' : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `header-nav-link${isActive ? ' active' : ''}`
            }
            onClick={handleNavClick}
          >
            Home
          </NavLink>
          <NavLink
            to="/apply"
            className={({ isActive }) =>
              `header-nav-link${isActive ? ' active' : ''}`
            }
            onClick={handleNavClick}
          >
            Apply
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `header-nav-link${isActive ? ' active' : ''}`
            }
            onClick={handleNavClick}
          >
            Admin
          </NavLink>
        </nav>

        <div className={`header-actions${menuOpen ? ' header-actions-open' : ''}`}>
          {loggedIn ? (
            <button className="header-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="header-login-btn" onClick={handleLogin}>
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}