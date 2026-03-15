'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Zap, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    // Clear auth cookie
    document.cookie = 'yard_sync_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    logout();
    router.push('/auth/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/horses', label: 'Horses', icon: Zap },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  if (!mounted) return null;

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center rounded-lg bg-white p-2 text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-200"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo / Header */}
          <div className="border-b border-slate-700 px-6 py-6">
            <h1 className="text-2xl font-bold text-white">Yard Sync</h1>
            <p className="mt-1 text-sm text-slate-300">Horse Management</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="border-t border-slate-700 px-4 py-6">
            <button
              onClick={handleLogout}
              className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content offset for desktop */}
      <div className="hidden md:block w-64 flex-shrink-0" />
    </>
  );
}
