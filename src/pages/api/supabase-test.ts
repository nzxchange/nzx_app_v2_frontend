import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test basic connection
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    // Test a simple query
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    res.status(200).json({
      success: true,
      session: {
        exists: !!sessionData.session,
        error: sessionError?.message
      },
      test: {
        success: !testError,
        error: testError?.message,
        data: testData
      },
      env: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 10) + '...',
        keyExists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
} 