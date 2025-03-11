import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash fragment
        const hashFragment = window.location.hash;
        if (!hashFragment) {
          throw new Error('No hash fragment found');
        }

        const params = new URLSearchParams(hashFragment.substring(1));
        const type = params.get('type');

        if (type === 'recovery') {
          // For password reset, redirect to reset-password-confirm
          router.push(`/auth/reset-password-confirm${hashFragment}`);
        } else {
          // For other auth callbacks, handle accordingly
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/auth/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing your request...</p>
      </div>
    </div>
  );
} 