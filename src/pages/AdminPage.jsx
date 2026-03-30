import { useState } from 'react';
import { isLoggedIn } from '../utils/session.js';
import AdminLogin from './AdminLogin.jsx';
import AdminDashboard from './AdminDashboard.jsx';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(() => isLoggedIn());

  const handleLogin = () => {
    setAuthenticated(true);
  };

  if (!authenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard />;
}