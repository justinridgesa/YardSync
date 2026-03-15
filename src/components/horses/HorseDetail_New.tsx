'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useHorse } from '@/lib/hooks/useHorses';
import { formatDate } from '@/lib/date-utils';
import { MedicalHistoryTab } from './MedicalHistoryTab';
import { VaccinationsTab } from './VaccinationsTab';
import { NotesTab } from './NotesTab';
import { TasksTab } from './TasksTab';
import { AddMedicalRecord } from './AddMedicalRecord';
import { AddVaccination } from './AddVaccination';
import { AddNote } from './AddNote';
import { AddTask } from './AddTask';

interface HorseDetailProps {
  horseId: string;
}

type TabType = 'overview' | 'medical' | 'vaccinations' | 'notes' | 'tasks';
type AddFormType = 'medical' | 'vaccination' | 'note' | 'task' | null;

export function HorseDetail({ horseId }: HorseDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [addingForm, setAddingForm] = useState<AddFormType>(null);
  const { data: horse, isLoading, error } = useHorse(horseId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading horse details...</p>
      </div>
    );
  }

  if (error || !horse) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800">
        <p>Error loading horse details. Please try again.</p>
      </div>
    );
  }

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'medical', label: 'Medical History', count: horse.medicalHistory?.length || 0 },
    { id: 'vaccinations', label: 'Vaccinations', count: horse.vaccinations?.length || 0 },
    { id: 'notes', label: 'Notes', count: horse._count?.notes || 0 },
    { id: 'tasks', label: 'Tasks', count: horse._count?.tasks || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{horse.name}</h1>
            <p className="mt-2 text-gray-600">{horse.breed}</p>
          </div>
          <div className="text-right mr-4">
            <p className="text-lg font-semibold text-gray-900">{horse.age} years old</p>
            <p className="text-sm text-gray-500">{horse.color}</p>
          </div>
          <div>
            <Link
              href={`/horses/${horseId}/edit`}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Edit
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Sex</p>
            <p className="mt-1 text-sm text-gray-900">{horse.sex}</p>
          </div>
          {horse.assignedGroom && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Groom</p>
              <p className="mt-1 text-sm text-gray-900">{horse.assignedGroom.name}</p>
            </div>
          )}
          {horse.owner && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Owner</p>
              <p className="mt-1 text-sm text-gray-900">{horse.owner.name}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">ID</p>
            <p className="mt-1 text-xs text-gray-600 font-mono">{horse.id}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {activeTab === 'overview' && <OverviewTab horse={horse} />}

        {activeTab === 'medical' && (
          <div>
            {addingForm === 'medical' ? (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Add Medical Record</h3>
                <AddMedicalRecord
                  horseId={horseId}
                  onClose={() => setAddingForm(null)}
                />
              </div>
            ) : null}
            <MedicalHistoryTab
              horseId={horseId}
              records={horse.medicalHistory || []}
              onAddClick={() => setAddingForm('medical')}
            />
          </div>
        )}

        {activeTab === 'vaccinations' && (
          <div>
            {addingForm === 'vaccination' ? (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Add Vaccination</h3>
                <AddVaccination
                  horseId={horseId}
                  onClose={() => setAddingForm(null)}
                />
              </div>
            ) : null}
            <VaccinationsTab
              horseId={horseId}
              records={horse.vaccinations || []}
              onAddClick={() => setAddingForm('vaccination')}
            />
          </div>
        )}

        {activeTab === 'notes' && (
          <div>
            {addingForm === 'note' ? (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Add Note</h3>
                <AddNote
                  horseId={horseId}
                  onClose={() => setAddingForm(null)}
                />
              </div>
            ) : null}
            <NotesTab
              horseId={horseId}
              records={horse.notes || []}
              onAddClick={() => setAddingForm('note')}
            />
          </div>
        )}

        {activeTab === 'tasks' && (
          <div>
            {addingForm === 'task' ? (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Add Task</h3>
                <AddTask
                  horseId={horseId}
                  onClose={() => setAddingForm(null)}
                />
              </div>
            ) : null}
            <TasksTab
              horseId={horseId}
              records={horse.tasks || []}
              onAddClick={() => setAddingForm('task')}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function OverviewTab({ horse }: any) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900">Basic Information</h3>
        <dl className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Breed</dt>
            <dd className="mt-1 text-sm text-gray-900">{horse.breed}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Color</dt>
            <dd className="mt-1 text-sm text-gray-900">{horse.color}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Age</dt>
            <dd className="mt-1 text-sm text-gray-900">{horse.age} years</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Sex</dt>
            <dd className="mt-1 text-sm text-gray-900">{horse.sex}</dd>
          </div>
        </dl>
      </div>

      {horse.assignedGroom && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-gray-900">Assigned Groom</h3>
          <p className="mt-2 text-sm text-gray-600">{horse.assignedGroom.name}</p>
          <p className="text-xs text-gray-500">{horse.assignedGroom.email}</p>
        </div>
      )}

      {horse.owner && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-gray-900">Owner</h3>
          <p className="mt-2 text-sm text-gray-600">{horse.owner.name}</p>
          <p className="text-xs text-gray-500">{horse.owner.email}</p>
        </div>
      )}
    </div>
  );
}
