import { supabase } from "@/integrations/supabase/client";

export interface AdminSession {
  username: string;
  isAdmin: boolean;
}

const ADMIN_SESSION_KEY = 'elsondev_admin_session';

export const loginAdmin = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('username, password_hash')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }

    if (!data) {
      return { success: false, error: 'Invalid username or password.' };
    }

    if (data.password_hash !== password) {
      return { success: false, error: 'Invalid username or password.' };
    }

    // Store session
    const session: AdminSession = {
      username: data.username,
      isAdmin: true
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));

    return { success: true };
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, error: 'An unexpected error occurred.' };
  }
};

export const logoutAdmin = (): void => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
};

export const getAdminSession = (): AdminSession | null => {
  try {
    const sessionStr = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!sessionStr) return null;
    return JSON.parse(sessionStr) as AdminSession;
  } catch {
    return null;
  }
};

export const isAdminLoggedIn = (): boolean => {
  const session = getAdminSession();
  return session?.isAdmin === true;
};
