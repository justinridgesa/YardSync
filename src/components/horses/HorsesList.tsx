'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useHorses, type Horse } from '@/lib/hooks/useHorses';

interface HorsesListProps {
  yardId: string;
}

export function HorsesList({ yardId }: HorsesListProps) {
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useHorses(yardId, search);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading horses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800">
        <p className="font-semibold">Error loading horses</p>
        <p className="text-sm mt-1">{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }

  const horses = data?.horses || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Search horses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <Link
          href="/horses/new"
          className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Add Horse
        </Link>
      </div>

      {horses.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">No horses found. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {horses.map((horse: Horse) => (
            <Link
              key={horse.id}
              href={`/horses/${horse.id}`}
              className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{horse.name}</h3>
                  <p className="text-sm text-gray-600">{horse.breed}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{horse.age} years</p>
                  <p className="text-xs text-gray-500">{horse.color}</p>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="space-y-2 text-sm">
                  {horse.groom && (
                    <p className="text-gray-600">
                      <span className="font-medium">Groom:</span> {horse.groom.name}
                    </p>
                  )}
                  {horse.owner && (
                    <p className="text-gray-600">
                      <span className="font-medium">Owner:</span> {horse.owner.name}
                    </p>
                  )}
                </div>

                {horse._count && (
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span>{horse._count.notes} notes</span>
                    <span>{horse._count.tasks} tasks</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500">
        Total: {horses.length} {horses.length === 1 ? 'horse' : 'horses'}
      </p>
    </div>
  );
}
