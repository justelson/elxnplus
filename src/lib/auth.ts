import { supabase } from "@/integrations/supabase/client";

export interface AdminSession {
  email: string;
  isAdmin: boolean;
}

export const loginAdmin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data.user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('user_id, email')
      .eq('user_id', data.user.id)
      .maybeSingle();

    if (adminError || !admin) {
      await supabase.auth.signOut();
      return { success: false, error: 'This account is not an admin.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, error: 'An unexpected error occurred.' };
  }
};

export const logoutAdmin = async (): Promise<void> => {
  await supabase.auth.signOut();
};

export const getAdminSession = async (): Promise<AdminSession | null> => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !sessionData.session?.user) {
    return null;
  }

  const user = sessionData.session.user;
  const { data: admin, error: adminError } = await supabase
    .from('admins')
    .select('email')
    .eq('user_id', user.id)
    .maybeSingle();

  if (adminError || !admin) {
    return null;
  }

  return {
    email: admin.email || user.email || '',
    isAdmin: true,
  };
};

export const isAdminLoggedIn = async (): Promise<boolean> => {
  const session = await getAdminSession();
  return session?.isAdmin === true;
};
