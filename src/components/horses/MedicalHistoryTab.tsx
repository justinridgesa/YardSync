'use client';

import { useState } from 'react';
import { useDeleteMedicalHistory } from '@/lib/hooks/useHorseRecords';
import { formatDate } from '@/lib/date-utils';

interface MedicalRecord {
  id: string;
  date: string;
  condition: string;
  treatment: string;
}

interface MedicalHistoryTabProps {
  horseId: string;
  records: MedicalRecord[];
  onAddClick: () => void;
}

export function MedicalHistoryTab({ horseId, records, onAddClick }: MedicalHistoryTabProps) {
  const deleteMutation = useDeleteMedicalHistory(horseId);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (recordId: string) => {
    if (confirm('Are you sure you want to delete this medical record?')) {
      try {
        setDeleting(recordId);
        await deleteMutation.mutateAsync(recordId);
      } finally {
        setDeleting(null);
      }
    }
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No medical history recorded.</p>
        <button
          onClick={onAddClick}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          + Add Medical Record
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
        + Add Medical Record
      </button>
      {records.map((record) => (
        <div key={record.id} className="border-l-4 border-blue-500 bg-blue-50 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{record.condition}</p>
              <p className="text-sm text-gray-600 mt-1">{record.treatment}</p>
            </div>
            <div className="text-right ml-4 flex-shrink-0">
              <p className="text-sm text-gray-500">{formatDate(record.date)}</p>
              <button
                onClick={() => handleDelete(record.id)}
                disabled={deleting === record.id}
                className="mt-2 text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                {deleting === record.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
