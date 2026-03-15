'use client';

import Link from 'next/link';
import { HorseForm } from '@/components/horses/HorseForm';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

export default function NewHorsePage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header title="Add New Horse" subtitle="Fill in the details below to add a new horse to your yard" />

        <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
            <HorseForm />
          </div>
        </main>
      </div>
    </div>
  );
}
