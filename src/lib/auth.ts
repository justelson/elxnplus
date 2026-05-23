import { convex } from '@/integrations/convex/client';
import { api } from '../../convex/_generated/api';

export interface AdminSession {
  email: string;
  isAdmin: boolean;
  expiresAt: number;
}

const ADMIN_SESSION_KEY = 'elxnplus_admin_session_token';

export const getAdminToken = (): string | null => {
  return localStorage.getItem(ADMIN_SESSION_KEY);
};

export const loginAdmin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const session = await convex.mutation(api.auth.login, { email, password });
    localStorage.setItem(ADMIN_SESSION_KEY, session.token);
    return { success: true };
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, error: 'Invalid email or password.' };
  }
};

export const logoutAdmin = async (): Promise<void> => {
  const token = getAdminToken();
  localStorage.removeItem(ADMIN_SESSION_KEY);

  if (token) {
    try {
      await convex.mutation(api.auth.logout, { token });
    } catch (err) {
      console.error('Logout error:', err);
    }
  }
};

export const getAdminSession = async (): Promise<AdminSession | null> => {
  const token = getAdminToken();
  if (!token) return null;

  try {
    const session = await convex.query(api.auth.getSession, { token });
    if (!session) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }
    return session;
  } catch (err) {
    console.error('Session error:', err);
    return null;
  }
};

export const refreshAdminSession = async (): Promise<AdminSession | null> => {
  const token = getAdminToken();
  if (!token) return null;

  try {
    const session = await convex.mutation(api.auth.refreshSession, { token });
    if (!session) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }
    return session;
  } catch (err) {
    console.error('Refresh session error:', err);
    return null;
  }
};

export const isAdminLoggedIn = async (): Promise<boolean> => {
  const session = await refreshAdminSession();
  return session?.isAdmin === true;
};
