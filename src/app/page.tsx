import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Header - No home button on home page */}
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
              <span className="text-white font-bold text-lg">Y</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Yard Sync
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Welcome
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Horse & Yard Management Platform
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Welcome</h2>
            <p className="mt-4 text-base text-gray-500">
              Centralize task tracking, horse records, and real-time notes.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-8 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Features Overview */}
          <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-200 hover:border-gray-200 hover:shadow-md sm:p-10">
              <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-100/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-gray-900">
                  Horse Profiles
                </h3>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                  Complete records with medical history, feed plans, and vaccinations.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-200 hover:border-gray-200 hover:shadow-md sm:p-10">
              <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-gradient-to-br from-blue-100/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-gray-900">
                  Task Engine
                </h3>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                  Daily, weekly, and monthly recurring tasks with offline support.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-200 hover:border-gray-200 hover:shadow-md sm:p-10">
              <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-gradient-to-br from-amber-100/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-gray-900">
                  Activity Feed
                </h3>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                  Timestamped notes and alerts replace WhatsApp communication.
                </p>
              </div>
            </div>
          </div>

          {/* Tech Stack Info */}
          <div className="mt-20 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
            <h3 className="text-lg font-semibold text-gray-900">
              MVP Status: Foundation Phase
            </h3>
            <p className="mt-3 text-sm text-gray-600">
              This is a full-stack web application built with modern open-source technologies:
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-semibold">✓</span>
                <span className="text-sm text-gray-700">Next.js 14 (Frontend & API)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-semibold">✓</span>
                <span className="text-sm text-gray-700">SQLite + Prisma (Database)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-semibold">✓</span>
                <span className="text-sm text-gray-700">TypeScript (Type Safety)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-semibold">✓</span>
                <span className="text-sm text-gray-700">TailwindCSS (Styling)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-semibold">✓</span>
                <span className="text-sm text-gray-700">React Query (State)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-semibold">✓</span>
                <span className="text-sm text-gray-700">Responsive Design</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2026 Yard Sync. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
