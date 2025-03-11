import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testAuth() {
  console.log('Testing Supabase configuration...');
  
  // Check environment variables
  console.log('Environment variables:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 10) + '...');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  // Test Supabase connection
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const { data, error } = await supabase.auth.getSession();
    console.log('Supabase connection test:', error ? 'Failed' : 'Success');
    if (error) console.error('Error:', error.message);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAuth(); 