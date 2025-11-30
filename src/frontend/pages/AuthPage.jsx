import React from 'react';

function AuthPage({ view = 'login', error, baseUrl }) {
  const isLogin = view === 'login';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-5xl">
        <div className="absolute -top-10 -left-6 h-28 w-28 rounded-full bg-blue-100 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-14 -right-10 h-36 w-36 rounded-full bg-indigo-100 blur-3xl" aria-hidden="true" />

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr,0.9fr] bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
          <div className="hidden lg:flex flex-col gap-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-10">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.45em] text-white/70">Dev25Expenies</p>
              <h2 className="text-3xl font-semibold leading-snug">
                {isLogin ? 'Welcome back!' : 'Join our spending community'}
              </h2>
              <p className="text-sm text-white/80 leading-relaxed">
                {isLogin
                  ? 'Track your expenses effortlessly with tailored categories, detailed receipts, and actionable insights.'
                  : 'Create an account to unlock colorful dashboards, smart categories, and document tracking for hassle-free finances.'}
              </p>
            </div>

            <ul className="space-y-3 text-sm text-white/85">
              <li className="flex items-center gap-3">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-white/60" />
                Visual dashboards and analytics
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-white/60" />
                Color-coded categories & filters
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-white/60" />
                Secure receipt uploads and storage
              </li>
            </ul>

            <div className="mt-auto">
              <p className="text-xs text-white/70">Need help? Contact support@dev25expenies.test</p>
            </div>
          </div>

          <div className="w-full p-8 sm:p-10 space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-1">
                {isLogin ? 'Login to your account' : 'Create your account'}
              </h1>
              <p className="text-sm text-slate-500">
                {isLogin
                  ? 'Enter your credentials to continue managing your expenses.'
                  : 'Fill in your details below to get started, it only takes a minute.'}
              </p>
            </div>

            {error && (
              <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            )}

            <form
              action={`${baseUrl}${isLogin ? '/login' : '/register'}`}
              method="POST"
              className="space-y-4"
            >
              {!isLogin && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {!isLogin && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700" htmlFor="phone">
                    Phone (optional)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full inline-flex justify-center items-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                {isLogin ? 'Login' : 'Register'}
              </button>
            </form>

            <p className="text-xs text-slate-500 text-center">
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <a
                    href={`${baseUrl}/register`}
                    className="font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Register here
                  </a>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <a
                    href={`${baseUrl}/login`}
                    className="font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Login here
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
