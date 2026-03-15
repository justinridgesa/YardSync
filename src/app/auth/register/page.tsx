'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';

export default function AuthRegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // TODO: Implement actual registration via API
      console.log('Register attempt:', formData);
      
      // Placeholder: create mock user session
      const mockUser = {
        id: '1',
        email: formData.email,
        name: formData.name,
      };
      
      login(mockUser);
      
      // Set auth cookie for middleware with proper formatting
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + (7 * 24 * 60 * 60 * 1000));
      document.cookie = `yard_sync_token=${mockUser.id};path=/;expires=${expiryDate.toUTCString()}`;
      
      // Small delay to ensure cookie is set, then redirect
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Create Account
          </h2>
          <p className="mt-3 text-base text-gray-500">
            Yard managers can create a Yard Sync account
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                placeholder="John Manager"
              />
            </div>

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
                value={formData.email}
                onChange={handleChange}
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
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-semibold text-gray-900">
                Confirm Password
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                required
                value={formData.passwordConfirm}
                onChange={handleChange}
                className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-center font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
