'use client';

import { useState } from 'react';
import { useDeleteVaccination } from '@/lib/hooks/useHorseRecords';
import { formatDate } from '@/lib/date-utils';

interface Vaccination {
  id: string;
  name: string;
  date: string;
  expiryDate: string;
}

interface VaccinationsTabProps {
  horseId: string;
  records: Vaccination[];
  onAddClick: () => void;
}

export function VaccinationsTab({ horseId, records, onAddClick }: VaccinationsTabProps) {
  const deleteMutation = useDeleteVaccination(horseId);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (recordId: string) => {
    if (confirm('Are you sure you want to delete this vaccination record?')) {
      try {
        setDeleting(recordId);
        await deleteMutation.mutateAsync(recordId);
      } finally {
        setDeleting(null);
      }
    }
  };

  const isExpired = (expiryDate: string) => new Date(expiryDate) < new Date();

  if (records.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No vaccinations recorded.</p>
        <button
          onClick={onAddClick}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          + Add Vaccination
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={onAddClick}
        className="mb-4 text-blue-600 hover:text-blue-800 font-medium"
      >
        + Add Vaccination
      </button>
      {records.map((vax) => (
        <div
          key={vax.id}
          className={`flex items-between justify-between rounded-lg border p-4 ${
            isExpired(vax.expiryDate)
              ? 'border-red-300 bg-red-50'
              : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{vax.name}</p>
            <p className="text-sm text-gray-500">
              Given: {formatDate(vax.date)}
            </p>
          </div>
          <div className="text-right ml-4 flex-shrink-0">
            <p className="text-sm text-gray-600">Expires:</p>
            <p
              className={`font-semibold ${
                isExpired(vax.expiryDate)
                  ? 'text-red-600'
                  : 'text-gray-900'
              }`}
            >
              {formatDate(vax.expiryDate)}
            </p>
            <button
              onClick={() => handleDelete(vax.id)}
              disabled={deleting === vax.id}
              className="mt-2 text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              {deleting === vax.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
