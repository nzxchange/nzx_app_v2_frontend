import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Layout } from '@/components/layout/Layout';
import Head from 'next/head';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabaseClient';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await router.push('/dashboard');
        }
        if (event === 'SIGNED_OUT') {
          await router.push('/auth/login');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Check if current page is an auth page
  const isAuthPage = router.pathname.startsWith('/auth/');

  return (
    <>
      <Head>
        <title>NZX Energy Platform</title>
        <meta name="description" content="NZX Energy Platform for carbon credit management" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionContextProvider supabaseClient={supabase}>
        {isAuthPage ? (
          // Render auth pages without Layout
          <Component {...pageProps} />
        ) : (
          // Wrap non-auth pages with Layout
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </SessionContextProvider>
    </>
  );
}