import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

// Get the current base URL for redirects
export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
};

// Auth state management
export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user || null;
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

// Sign in with magic link
export const signInWithMagicLink = async (email: string) => {
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getBaseUrl()}/auth/callback`,
    },
  });
};

// Sign out
export const signOut = async () => {
  return supabase.auth.signOut();
};

// Reset password
export const resetPassword = async (email: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
  const redirectTo = `${baseUrl}/auth/callback`;
  
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo,
  });
};

// Update password
export const updatePassword = async (password: string) => {
  return supabase.auth.updateUser({ password });
};

// Add this function to handle reset password
export const handlePasswordReset = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password-confirm`,
  });
  return { error };
}; 