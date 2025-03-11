import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthDebug() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'demo@example.com',
        password: 'demo12345',
      });
      
      setResult({ data, error });
      console.log('Login test:', { data, error });
    } catch (e) {
      setResult({ error: e });
      console.error('Login exception:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', borderRadius: '5px' }}>
      <h3>Auth Debugging</h3>
      <button 
        onClick={testLogin} 
        disabled={loading}
        style={{ 
          padding: '8px 16px', 
          background: '#6366f1', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Login'}
      </button>
      
      {result && (
        <pre style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5', overflow: 'auto' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
} 