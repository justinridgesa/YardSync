'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateHorse, useUpdateHorse, useHorse } from '@/lib/hooks/useHorses';

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface HorseFormProps {
  horseId?: string;
  yardId?: string;
  onSuccess?: () => void;
}

export function HorseForm({ horseId, yardId, onSuccess }: HorseFormProps) {
  const router = useRouter();
  const { data: existingHorse, isLoading: isLoadingHorse } = useHorse(horseId);
  const createMutation = useCreateHorse();
  const updateMutation = useUpdateHorse(horseId || '');

  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: 0,
    sex: '',
    color: '',
    assignedGroom: '',
    ownerId: '',
  });

  const [grooms, setGrooms] = useState<TeamMember[]>([]);
  const [owners, setOwners] = useState<TeamMember[]>([]);
  const [currentYardId, setCurrentYardId] = useState<string | null>(yardId || null);

  // Fetch yard ID on mount if not provided
  useEffect(() => {
    if (!currentYardId || currentYardId === 'dummy') {
      const fetchYardId = async () => {
        try {
          console.log('[HorseForm] Fetching yard ID...');
          const res = await fetch('/api/yards');
          console.log('[HorseForm] Yard fetch response status:', res.status);
          if (res.ok) {
            const data = await res.json();
            console.log('[HorseForm] Yard data:', data);
            const yards = data.yards || [];
            if (yards.length > 0) {
              console.log('[HorseForm] Setting currentYardId to:', yards[0].id);
              setCurrentYardId(yards[0].id);
            } else {
              console.log('[HorseForm] No yards found in response');
            }
          } else {
            console.error('[HorseForm] Yard fetch failed with status:', res.status);
          }
        } catch (err) {
          console.error('[HorseForm] Failed to fetch yard:', err);
        }
      };
      fetchYardId();
    }
  }, [yardId, currentYardId]);

  // Fetch team members (grooms and owners)
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!currentYardId) {
        console.log('[HorseForm] currentYardId not set, skipping fetch');
        return;
      }
      try {
        console.log('[HorseForm] Fetching team members for yard:', currentYardId);
        const res = await fetch(`/api/yards/${currentYardId}/team`);
        console.log('[HorseForm] Team fetch response status:', res.status);
        if (res.ok) {
          const data = await res.json();
          console.log('[HorseForm] Team data:', data);
          const members = data.members || [];
          console.log('[HorseForm] All members:', members);
          const filteredGrooms = members.filter((m: TeamMember) => m.role === 'GROOM');
          const filteredOwners = members.filter((m: TeamMember) => m.role === 'OWNER');
          console.log('[HorseForm] Filtered grooms:', filteredGrooms);
          console.log('[HorseForm] Filtered owners:', filteredOwners);
          setGrooms(filteredGrooms);
          setOwners(filteredOwners);
        } else {
          console.error('[HorseForm] Team fetch failed with status:', res.status);
        }
      } catch (err) {
        console.error('[HorseForm] Failed to fetch team members:', err);
      }
    };

    fetchTeamMembers();
  }, [currentYardId]);

  // Update form when existing horse data loads
  useEffect(() => {
    if (existingHorse) {
      console.log('[HorseForm] Existing horse loaded', existingHorse);
      // If we have a yardId from the horse data, use it
      if (existingHorse.yardId && !yardId) {
        console.log('[HorseForm] Setting currentYardId from existing horse:', existingHorse.yardId);
        setCurrentYardId(existingHorse.yardId);
      }
      setFormData({
        name: existingHorse.name,
        breed: existingHorse.breed || '',
        age: existingHorse.age,
        sex: existingHorse.sex || '',
        color: existingHorse.color || '',
        assignedGroom: existingHorse.assignedGroom || '',
        ownerId: existingHorse.owner?.id || '',
      });
    }
  }, [existingHorse, yardId]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Convert empty strings to null for optional fields
      const payload = {
        name: formData.name,
        breed: formData.breed,
        age: formData.age,
        sex: formData.sex || null,
        color: formData.color || null,
        assignedGroom: formData.assignedGroom || null,
        ownerId: formData.ownerId || null,
        yardId: currentYardId,
      };

      if (horseId) {
        await updateMutation.mutateAsync(payload);
      } else {
        await createMutation.mutateAsync(payload);
      }

      onSuccess?.();
      router.push(horseId ? `/horses/${horseId}` : '/horses');
    } catch (err: unknown) {
      const errorMsg = typeof err === 'object' && err !== null && 'message' in err
        ? String((err as Record<string, unknown>).message)
        : 'An error occurred';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingHorse && horseId) {
    return <div className="text-center py-12 text-gray-500">Loading horse data...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Horse Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="e.g., Equestrian"
          />
        </div>

        {/* Breed */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Breed *
          </label>
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="e.g., Thoroughbred"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Age (years) *
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="0"
            max="50"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Sex */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sex
          </label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select sex (optional)</option>
            <option value="Mare">Mare</option>
            <option value="Gelding">Gelding</option>
            <option value="Stallion">Stallion</option>
          </select>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="e.g., Chestnut"
          />
        </div>

        {/* Assigned Groom */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Assigned Groom
          </label>
          <select
            name="assignedGroom"
            value={formData.assignedGroom}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select a groom (optional)</option>
            {grooms.map((groom) => (
              <option key={groom.id} value={groom.id}>
                {groom.name}
              </option>
            ))}
          </select>
        </div>

        {/* Owner */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Owner
          </label>
          <select
            name="ownerId"
            value={formData.ownerId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select an owner (optional)</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : horseId ? 'Update Horse' : 'Create Horse'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
