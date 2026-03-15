'use client';

import { useState } from 'react';
import { useCreateNote } from '@/lib/hooks/useHorseRecords';

interface AddNoteProps {
  horseId: string;
  onClose: () => void;
}

export function AddNote({ horseId, onClose }: AddNoteProps) {
  const mutation = useCreateNote(horseId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    content: '',
    tag: 'GENERAL',
    authorId: '1',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await mutation.mutateAsync(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-red-800 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Note</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            rows={4}
            placeholder="Add a note about this horse..."
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tag</label>
          <select
            value={formData.tag}
            onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="GENERAL">General</option>
            <option value="BEHAVIORAL">Behavioral</option>
            <option value="HEALTH">Health</option>
            <option value="TRAINING">Training</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
          >
            {loading ? 'Adding...' : 'Add Note'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-700 hover:bg-gray-50 text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
