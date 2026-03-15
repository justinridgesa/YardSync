'use client';

import { useEffect, useState } from 'react';
import { HorsesList } from '@/components/horses/HorsesList';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

export default function HorsesPage() {
  const [yardId, setYardId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the first available yard
    const fetchYard = async () => {
      try {
        console.log('Fetching yards...');
        const response = await fetch('/api/yards');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Yards data:', data);
        
        if (data.yards && data.yards.length > 0) {
          console.log('Setting yard ID:', data.yards[0].id);
          setYardId(data.yards[0].id);
        } else {
          setError('No yards found. Please create a yard first.');
        }
      } catch (err) {
        console.error('Error fetching yards:', err);
        setError(err instanceof Error ? err.message : 'Failed to load yards');
      } finally {
        setLoading(false);
      }
    };

    fetchYard();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header title="Horses" subtitle="Manage all horses in your yard" />

        <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
          {loading && <div className="flex items-center justify-center py-12"><p className="text-gray-500">Loading yard information...</p></div>}
          {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900"><p className="text-sm">{error}</p></div>}
          {yardId && <HorsesList yardId={yardId} />}
        </main>
      </div>
    </div>
  );
}
