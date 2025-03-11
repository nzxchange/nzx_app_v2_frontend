import { useState, useRef } from 'react';
import { resetPassword } from '@/lib/auth';

export default function PasswordReset() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    const email = emailRef.current?.value || '';
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) throw error;
      
      setMessage({
        text: 'Password reset email sent!',
        type: 'success'
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      setMessage({
        text: error.message || 'Failed to send reset email',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => document.getElementById('reset-form')?.classList.toggle('hidden')}
        className="text-sm text-indigo-600 hover:text-indigo-500"
      >
        Forgot your password?
      </button>
      
      <div id="reset-form" className="hidden mt-4 p-4 border border-gray-200 rounded-md">
        {message && (
          <div className={`mb-4 p-2 rounded ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleReset}>
          <div>
            <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="reset-email"
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
            {loading ? 'Sending...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
} 