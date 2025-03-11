import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { getOrCreateDefaultPortfolio } from '@/lib/utils/portfolioUtils';

export default function ConfirmAuth() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function initializeUserData() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/auth/login');
                    return;
                }

                // Create default portfolio and organization
                const portfolio = await getOrCreateDefaultPortfolio(supabase, user.id);
                
                // Redirect to assets page with the new portfolio
                router.push(`/assets?portfolio=${portfolio.id}`);
            } catch (error: any) {
                console.error('Error initializing user data:', error);
                setError(error.message);
            }
        }

        initializeUserData();
    }, [router]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
    );
} 