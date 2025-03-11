import Head from 'next/head';

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Sign up Success</title>
      </Head>

      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <img src="/logo.png" alt="Logo" className="h-12 w-12" />
        </div>

        <h2 className="mt-6 text-3xl font-extrabold text-white">
          Check your email
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          We've sent you an email with a link to verify your account.
          Please check your inbox and follow the instructions to complete your registration.
        </p>

        <div className="mt-4">
          <a
            href="/auth/login"
            className="font-medium text-purple-500 hover:text-purple-400"
          >
            Return to login
          </a>
        </div>
      </div>
    </div>
  );
} 