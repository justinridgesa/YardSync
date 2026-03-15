'use client';

import { useState } from 'react';
import { useDeleteNote } from '@/lib/hooks/useHorseRecords';
import { formatDate } from '@/lib/date-utils';

interface Note {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface NotesTabProps {
  horseId: string;
  records: Note[];
  onAddClick: () => void;
}

export function NotesTab({ horseId, records, onAddClick }: NotesTabProps) {
  const deleteMutation = useDeleteNote(horseId);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (recordId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
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
        <p className="text-gray-500 mb-4">No notes yet.</p>
        <button
          onClick={onAddClick}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          + Add Note
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
        + Add Note
      </button>
      {records.map((note) => (
        <div key={note.id} className="border-l-4 border-gray-300 bg-gray-50 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{note.author.name}</p>
              <p className="text-sm text-gray-600 mt-1">{note.content}</p>
            </div>
            <div className="text-right ml-4 flex-shrink-0">
              <p className="text-sm text-gray-500">{formatDate(note.createdAt)}</p>
              <button
                onClick={() => handleDelete(note.id)}
                disabled={deleting === note.id}
                className="mt-2 text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                {deleting === note.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
