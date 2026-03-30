const SESSION_KEY = 'hirehub_admin_auth';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

function safeReadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw === null) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.isLoggedIn) {
      return null;
    }
    return parsed;
  } catch (e) {
    console.error('Corrupted session data, clearing:', e);
    safeRemoveSession();
    return null;
  }
}

function safeWriteSession(sessionData) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    return true;
  } catch (e) {
    console.error('Failed to write to sessionStorage:', e);
    return false;
  }
}

function safeRemoveSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Failed to remove session from sessionStorage:', e);
  }
}

export function login(username, password) {
  if (!username || typeof username !== 'string' || !username.trim()) {
    return { success: false, error: 'Username is required.' };
  }
  if (!password || typeof password !== 'string' || !password.trim()) {
    return { success: false, error: 'Password is required.' };
  }

  if (username.trim() !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return { success: false, error: 'Invalid username or password.' };
  }

  const sessionData = {
    isLoggedIn: true,
    loginTime: new Date().toISOString()
  };

  if (!safeWriteSession(sessionData)) {
    return { success: false, error: 'Failed to save session. Please try again.' };
  }

  return { success: true };
}

export function logout() {
  safeRemoveSession();
}

export function isLoggedIn() {
  const session = safeReadSession();
  return session !== null && session.isLoggedIn === true;
}

export function getSession() {
  return safeReadSession();
}

export const AdminSession = {
  login,
  logout,
  isLoggedIn,
  getSession
};