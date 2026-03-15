'use client';

import Link from 'next/link';
import { Home, LogOut, Settings } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, logout, user } = useAuth();
  const isHome = pathname === '/';
  const isSettings = pathname === '/settings';

  const handleLogout = () => {
    // Clear auth cookie
    document.cookie = 'yard_sync_token=; path=/; max-age=0';
    logout();
    router.push('/');
  };

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Branding + Title */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <Link
                href={isLoggedIn ? "/dashboard" : "/"}
                className="inline-flex items-center gap-2 group"
              >
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all duration-200">
                  <span className="text-white font-bold text-lg">Y</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-emerald-600 transition-colors duration-200">
                  Yard Sync
                </span>
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-base text-gray-500">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right: Action Buttons */}
          <div className="flex-shrink-0 ml-6 flex items-center gap-3">
            {!isHome && (
              <Link
                href={isLoggedIn ? "/dashboard" : "/"}
                className="group inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 sm:px-6 sm:py-3"
              >
                <Home className="h-4 w-4 text-gray-500 group-hover:text-emerald-600 transition-colors" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            )}
            {!isSettings && isLoggedIn && (
              <Link
                href="/settings"
                className="group inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 sm:px-6 sm:py-3"
              >
                <Settings className="h-4 w-4 text-gray-500 group-hover:text-emerald-600 transition-colors" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
            )}
            {isLoggedIn && (
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={handleLogout}
                  className="group inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:border-red-300 hover:bg-red-50 transition-all duration-200 sm:px-6 sm:py-3"
                >
                  <LogOut className="h-4 w-4 text-gray-500 group-hover:text-red-600 transition-colors" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
                {user && (
                  <p className="text-xs text-gray-600">
                    Welcome, {user.name.split(' ')[0]}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
