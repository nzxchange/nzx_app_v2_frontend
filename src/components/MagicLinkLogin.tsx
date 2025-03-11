import { useState, useRef } from 'react';
import { signInWithMagicLink } from '@/lib/auth';

export default function MagicLinkLogin() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    const email = emailRef.current?.value || '';
    
    try {
      const { error } = await signInWithMagicLink(email);
      
      if (error) throw error;
      
      setMessage({
        text: 'Check your email for the login link!',
        type: 'success'
      });
    } catch (error: any) {
      console.error('Magic link error:', error);
      setMessage({
        text: error.message || 'Failed to send magic link',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Or sign in with a magic link</h3>
      
      {message && (
        <div className={`mt-2 p-2 rounded ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleMagicLink} className="mt-4">
        <div>
          <label htmlFor="magic-email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="magic-email"
            type="email"
            ref={emailRef}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Enter your email"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>
      </form>
    </div>
  );
} 