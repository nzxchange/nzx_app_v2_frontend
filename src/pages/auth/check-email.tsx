import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const CheckEmail = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head>
                <title>Check Your Email</title>
            </Head>
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Check your email
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        We've sent you a confirmation email. Please check your inbox and click the link to verify your account.
                    </p>
                </div>
                <div className="text-center">
                    <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Return to login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CheckEmail; 