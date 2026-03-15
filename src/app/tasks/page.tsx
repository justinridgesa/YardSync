import Link from 'next/link';
import { Header } from '@/components/Header';

export default function TasksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header title="Tasks" subtitle="Manage daily & recurring tasks" />

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-12 shadow-sm text-center">
          <div className="mb-4 text-4xl">✓</div>
          <h2 className="text-2xl font-semibold text-gray-900">Task Management</h2>
          <p className="mt-2 text-gray-500 max-w-md">
            Comprehensive task management with daily, weekly, and monthly recurring tasks is coming soon.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors duration-200"
          >
            Return to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
