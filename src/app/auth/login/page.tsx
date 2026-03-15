'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

export default function AuthLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      const user = data.user;

      // Login user
      login(user);

      // Set auth cookie for middleware with proper formatting
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + (7 * 24 * 60 * 60 * 1000));
      document.cookie = `yard_sync_token=${user.id};path=/;expires=${expiryDate.toUTCString()}`;

      // Small delay to ensure cookie is set, then redirect
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 fixed inset-0">
      <div className="w-full max-w-md px-4">
        {!showForm ? (
          /* Landing Screen */
          <div className="rounded-2xl bg-white p-12 shadow-2xl text-center">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600">
                <span className="text-white font-bold text-2xl">Y</span>
              </div>
            </div>

            {/* Welcome */}
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Welcome
            </h1>

            {/* Sign In Button */}
            <button
              onClick={() => setShowForm(true)}
              className="w-full rounded-lg bg-emerald-600 px-6 py-3 text-center font-semibold text-white hover:bg-emerald-700 transition-colors duration-200"
            >
              Sign in
            </button>
          </div>
        ) : (
          /* Login Form */
          <div className="rounded-2xl bg-white p-8 shadow-2xl sm:p-10">
            <button
              onClick={() => setShowForm(false)}
              className="mb-6 text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back
            </button>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                  placeholder="manager@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-center font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
