'use client';

import { useParams } from 'next/navigation';
import { HorseDetail } from '@/components/horses/HorseDetail';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

export default function HorseDetailPage() {
  const params = useParams();
  const horseId = typeof params.id === 'string' ? params.id : params.id?.[0];

  if (!horseId) {
    return (
      <div className="flex min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <header className="border-b border-gray-200 bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-gray-900">Horse Not Found</h1>
            </div>
          </header>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header title="Horse Details" />

        <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
          <HorseDetail horseId={horseId} />
        </main>
      </div>
    </div>
  );
}
