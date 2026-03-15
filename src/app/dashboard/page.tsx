'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Pill, Zap } from 'lucide-react';
import { Header } from '@/components/Header';

export default function DashboardPage() {
  const [complianceStats, setComplianceStats] = useState({
    percentage: 0,
    completed: 0,
    total: 0,
  });

  // Animated number increment on page load
  useEffect(() => {
    let start = 0;
    const target = 87;
    const increment = target / 30;

    const timer = setInterval(() => {
      start = Math.min(start + increment, target);
      setComplianceStats(prev => ({ ...prev, percentage: Math.floor(start) }));
    }, 30);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setComplianceStats(prev => ({ ...prev, completed: 35, total: 40 }));
  }, []);

  const compliancePercentage = complianceStats.percentage;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (compliancePercentage / 100) * circumference;

  const statusItems = [
    { label: 'Fully Compliant', count: 5, icon: CheckCircle2, color: 'emerald' },
    { label: 'Incomplete', count: 1, icon: AlertCircle, color: 'amber' },
    { label: 'Urgent', count: 1, icon: Zap, color: 'red' },
  ];

  const quickActions = [
    {
      title: 'View Horses',
      description: 'All horses & details',
      href: '/horses',
      icon: '🐴',
      color: 'from-amber-50 to-orange-50',
      borderColor: 'amber',
    },
    {
      title: 'Manage Tasks',
      description: 'Daily & recurring',
      href: '/tasks',
      icon: '✓',
      color: 'from-emerald-50 to-green-50',
      borderColor: 'emerald',
    },
    {
      title: 'Expenses',
      description: 'View & export',
      href: '/expenses',
      icon: '💰',
      color: 'from-blue-50 to-cyan-50',
      borderColor: 'blue',
    },
    {
      title: 'Settings',
      description: 'Manage team',
      href: '/settings',
      icon: '⚙️',
      color: 'from-gray-50 to-slate-50',
      borderColor: 'slate',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header title="Manager Dashboard" subtitle="Real-time visibility of yard compliance, tasks, and horse health." />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Status Context Bar */}
        <div className="mb-8 rounded-xl border border-gray-100 bg-white p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-6">
            {statusItems.map((item) => {
              const Icon = item.icon;
              const colorMap: Record<string, string> = {
                emerald: 'text-emerald-600',
                amber: 'text-amber-600',
                red: 'text-red-600',
              };
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${colorMap[item.color]}`} />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {item.label}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">{item.count}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary KPI Cards */}
        <div className="grid gap-6 md:grid-cols-12 lg:gap-8">
          {/* Today's Compliance - Hero Card (6 columns) */}
          <div className="md:col-span-12 lg:col-span-6">
            <div className="group relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-200 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-100 sm:p-10">
              {/* Gradient accent background */}
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-100/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              <div className="relative z-10">
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Today's Compliance</h3>
                  <div className="rounded-full bg-emerald-100 p-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                  </div>
                </div>

                {/* Circular Progress Ring */}
                <div className="flex items-center justify-between gap-8 sm:gap-12">
                  {/* SVG Circle with centered percentage */}
                  <div className="relative flex-shrink-0">
                    <svg className="h-32 w-32 -rotate-90 transform sm:h-40 sm:w-40" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    {/* Percentage text overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-2xl font-bold text-gray-900 sm:text-3xl leading-none">{compliancePercentage}%</p>
                      <p className="text-xs text-gray-500 mt-1">Complete</p>
                    </div>
                  </div>

                  {/* Tasks completed info */}
                  <div className="flex-1">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Tasks Completed</p>
                      <div className="mt-2 flex items-baseline gap-1">
                        <p className="text-4xl font-bold text-gray-900 sm:text-5xl">{complianceStats.completed}</p>
                        <span className="text-xl font-semibold text-gray-400 sm:text-2xl">/{complianceStats.total}</span>
                      </div>
                    </div>

                    {/* Mini progress bar */}
                    <div className="space-y-2">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000 ease-out"
                          style={{ width: `${compliancePercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">Excellent progress today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Horses Card */}
          <div className="md:col-span-6 lg:col-span-3">
            <div className="group relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-200 hover:border-red-200 hover:shadow-md hover:shadow-red-100 sm:p-10">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-red-100/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              <div className="relative z-10">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Alert Horses</h3>
                  <div className="rounded-full bg-red-100 p-2">
                    <AlertCircle className="h-5 w-5 text-red-700" />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Critical Status */}
                  <div className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span className="text-sm font-medium text-gray-700">Critical</span>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-red-200 px-3 py-1 text-xs font-semibold text-red-800">
                      2
                    </span>
                  </div>

                  {/* Warning Status */}
                  <div className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                      <span className="text-sm font-medium text-gray-700">Warning</span>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold text-amber-800">
                      1
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* On Medication Card */}
          <div className="md:col-span-6 lg:col-span-3">
            <div className="group relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md hover:shadow-blue-100 sm:p-10">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-blue-100/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              <div className="relative z-10">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">On Medication</h3>
                  <div className="rounded-full bg-blue-100 p-2">
                    <Pill className="h-5 w-5 text-blue-700" />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Main number */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Horses</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">2</p>
                  </div>

                  {/* Visual representation */}
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full ${
                            i < 2 ? 'bg-blue-500' : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">2 of 7 horses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-12 sm:mt-16">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <p className="mt-1 text-sm text-gray-500">Jump to important management tools</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br ${action.color} p-6 shadow-sm transition-all duration-200 hover:border-gray-200 hover:shadow-md sm:p-8`}
              >
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-4 inline-block text-3xl">{action.icon}</div>

                  {/* Content */}
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{action.description}</p>

                  {/* Arrow indicator */}
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-700 opacity-0 transition-all duration-200 group-hover:opacity-100">
                    <span>Explore</span>
                    <svg
                      className="h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Metrics Summary - Optional Enhancement */}
        <div className="mt-12 sm:mt-16 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">System Status</h3>
              <p className="mt-1 text-sm text-gray-500">All systems operational</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-medium text-emerald-900">All Clear</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
