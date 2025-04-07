import { supabase } from '@/lib/supabase';
import { AuthError } from '@supabase/supabase-js';
import { useState } from 'react';
import { useRouter } from 'next/router';

interface AuthFormProps {
  mode: 'signup' | 'signin';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });

        if (error) {
          // Handle specific error cases
          if (error.message.includes('User already registered')) {
            setError('An account with this email already exists. Please sign in instead.');
            // Add a button or link to switch to sign in
            return;
          }
          throw error;
        }

        // Check if user was actually created (Supabase returns data even for existing users)
        if (data?.user?.identities?.length === 0) {
          setError('An account with this email already exists. Please sign in instead.');
          return;
        }

        // Success - show confirmation message
        router.push('/auth/check-email');
      } else {
        // Sign in flow
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Invalid email or password. Please try again.');
            return;
          }
          throw error;
        }

        // Success - redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      const error = err as AuthError;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {error}
            {error.includes('already exists') && (
              <button
                type="button"
                onClick={() => router.push('/auth/signin')}
                className="ml-2 text-blue-600 hover:text-blue-800 underline"
              >
                Sign in here
              </button>
            )}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Loading...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        {mode === 'signup' ? (
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/auth/signin')}
              className="text-blue-600 hover:text-blue-800"
            >
              Sign in
            </button>
          </p>
        ) : (
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/auth/signup')}
              className="text-blue-600 hover:text-blue-800"
            >
              Create one
            </button>
          </p>
        )}
      </div>
    </div>
  );
} 