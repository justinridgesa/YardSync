'use client';

import { useState } from 'react';
import { useDeleteTask, useUpdateTask } from '@/lib/hooks/useHorseRecords';

interface Task {
  id: string;
  title: string;
  status: string;
  description?: string;
  category?: string;
}

interface TasksTabProps {
  horseId: string;
  records: Task[];
  onAddClick: () => void;
}

export function TasksTab({ horseId, records, onAddClick }: TasksTabProps) {
  const deleteMutation = useDeleteTask(horseId);
  const updateMutation = useUpdateTask(horseId, '');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const handleDelete = async (recordId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        setDeleting(recordId);
        await deleteMutation.mutateAsync(recordId);
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleStatusChange = async (recordId: string, newStatus: string) => {
    try {
      setUpdating(recordId);
      await updateMutation.mutateAsync({ status: newStatus });
    } finally {
      setUpdating(null);
    }
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No pending tasks.</p>
        <button
          onClick={onAddClick}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          + Add Task
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={onAddClick}
        className="mb-4 text-blue-600 hover:text-blue-800 font-medium"
      >
        + Add Task
      </button>
      {records.map((task) => (
        <div key={task.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{task.title}</p>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(task.id, e.target.value)}
              disabled={updating === task.id}
              className={`rounded px-3 py-1 text-xs font-semibold ${getStatusColor(
                task.status
              )} disabled:opacity-50`}
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="OVERDUE">Overdue</option>
            </select>
            <button
              onClick={() => handleDelete(task.id)}
              disabled={deleting === task.id}
              className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              {deleting === task.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
