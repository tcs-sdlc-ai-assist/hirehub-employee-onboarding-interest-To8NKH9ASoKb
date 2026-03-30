import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../utils/session.js';
import './AdminLogin.css';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value);
    setErrors((prev) => {
      if (prev.username) {
        const next = { ...prev };
        delete next.username;
        return next;
      }
      return prev;
    });
    setSubmitError('');
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
    setErrors((prev) => {
      if (prev.password) {
        const next = { ...prev };
        delete next.password;
        return next;
      }
      return prev;
    });
    setSubmitError('');
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setSubmitError('');

      const validationErrors = {};
      if (!username || !username.trim()) {
        validationErrors.username = 'Username is required.';
      }
      if (!password || !password.trim()) {
        validationErrors.password = 'Password is required.';
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setSubmitting(true);

      const result = login(username.trim(), password);

      if (!result.success) {
        setSubmitError(result.error);
        setSubmitting(false);
        return;
      }

      setSubmitting(false);

      if (onLogin) {
        onLogin();
      }
    },
    [username, password, onLogin]
  );

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <h1 className="admin-login-title">Admin Login</h1>
            <p className="admin-login-subtitle">
              Sign in to access the admin dashboard and manage submissions.
            </p>
          </div>

          {submitError && (
            <div className="admin-login-error-banner">{submitError}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="admin-login-group">
              <label htmlFor="username" className="admin-login-label">
                Username<span className="admin-login-label-required">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className={`admin-login-input${errors.username ? ' admin-login-input-error' : ''}`}
                value={username}
                onChange={handleUsernameChange}
                placeholder="Enter your username"
                autoComplete="username"
              />
              {errors.username && (
                <span className="admin-login-field-error">{errors.username}</span>
              )}
            </div>

            <div className="admin-login-group">
              <label htmlFor="password" className="admin-login-label">
                Password<span className="admin-login-label-required">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`admin-login-input${errors.password ? ' admin-login-input-error' : ''}`}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              {errors.password && (
                <span className="admin-login-field-error">{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="admin-login-submit"
              disabled={submitting}
            >
              {submitting ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="admin-login-footer">
            <Link to="/" className="admin-login-back">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}