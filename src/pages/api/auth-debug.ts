import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1. Test environment variables
    const envCheck = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 10) + '...',
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
    };

    // 2. Test Supabase connection
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    // 3. Test auth endpoints
    const testEmail = 'test@example.com';
    const authTest = await supabase.auth.signInWithOtp({
      email: testEmail,
      options: {
        emailRedirectTo: 'http://localhost:3000/auth/callback',
      },
    });

    res.status(200).json({
      env: envCheck,
      supabaseConnection: {
        success: !testError,
        error: testError?.message,
        data: testData
      },
      authTest: {
        success: !authTest.error,
        error: authTest.error?.message
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 