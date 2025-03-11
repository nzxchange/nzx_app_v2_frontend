interface Config {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiUrl: string;
  environment: 'development' | 'production';
}

const development: Config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  apiUrl: 'http://localhost:8000/api',
  environment: 'development'
};

const production: Config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  environment: 'production'
};

const config: Config = process.env.NODE_ENV === 'production' ? production : development;

export const validateConfig = () => {
  const requiredVars = ['supabaseUrl', 'supabaseAnonKey', 'apiUrl'];
  const missingVars = requiredVars.filter(key => !config[key as keyof Config]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

export default config; 