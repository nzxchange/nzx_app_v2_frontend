import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Add debug logging
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables:', { 
    hasUrl: !!supabaseUrl, 
    hasKey: !!supabaseAnonKey 
  });
  throw new Error('Missing Supabase environment variables');
}

console.log('Initializing Supabase with:', {
  url: supabaseUrl.substring(0, 10) + '...',
  keyLength: supabaseAnonKey.length
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Test connection immediately
(async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    console.log('Supabase Connection Test:', error ? 'Failed' : 'Success', { error });
  } catch (e) {
    console.error('Supabase Init Error:', e);
  }
})();

// Add a debug function
export const debugSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    return {
      hasSession: !!data.session,
      error: error?.message,
      url: supabaseUrl?.substring(0, 10) + '...',
      keyExists: !!supabaseAnonKey
    };
  } catch (e) {
    const error = e as Error; // Type assertion
    return {
      error: error.message,
      url: supabaseUrl?.substring(0, 10) + '...',
      keyExists: !!supabaseAnonKey
    };
  }
}; 