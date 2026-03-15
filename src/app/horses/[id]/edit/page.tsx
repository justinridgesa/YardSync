'use client';

import { useParams } from 'next/navigation';
import { HorseForm } from '@/components/horses/HorseForm';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

export default function EditHorsePage() {
  const params = useParams();
  const horseId = typeof params.id === 'string' ? params.id : params.id?.[0];

  if (!horseId) {
    return (
      <div className="flex min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header title="Horse Not Found" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header title="Edit Horse" subtitle="Update horse information" />

        <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
            <HorseForm horseId={horseId} />
          </div>
        </main>
      </div>
    </div>
  );
}
