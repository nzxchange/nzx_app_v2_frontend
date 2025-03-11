import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test environment variables
    const envCheck = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 10) + '...',
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
    };

    // Remove or replace the invalid method
    // const settings = await supabase.auth.getSettings();

    res.status(200).json({
      success: true,
      env: envCheck,
      // settings, // Remove or replace this line if needed
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 