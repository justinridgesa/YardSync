import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/client';

export interface Horse {
  id: string;
  name: string;
  breed: string;
  age: number;
  color?: string;
  sex?: string;
  yardId?: string;
  assignedGroom?: string;
  groom?: {
    id: string;
    name: string;
    email: string;
  };
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    notes: number;
    tasks: number;
  };
}

export interface HorseDetail extends Horse {
  yardId?: string;
  yard?: {
    id: string;
    name: string;
  };
  groom?: {
    id: string;
    name: string;
    email: string;
  };
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  vaccinations: Array<{
    id: string;
    name: string;
    date: string;
    expiryDate: string;
  }>;
  medicalHistory: Array<{
    id: string;
    date: string;
    condition: string;
    treatment: string;
    attachments: Array<{
      id: string;
      url: string;
      type: string;
    }>;
  }>;
  notes: Array<{
    id: string;
    content: string;
    author: {
      id: string;
      name: string;
    };
    createdAt: string;
    attachments: Array<{
      id: string;
      url: string;
    }>;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    status: string;
  }>;
}

export function useHorses(yardId?: string, search?: string, assignedGroom?: string) {
  return useQuery<{ horses: Horse[]; total: number }>({
    queryKey: ['horses', yardId, search, assignedGroom],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (yardId) params.append('yardId', yardId);
      if (search) params.append('search', search);
      if (assignedGroom) params.append('assignedGroom', assignedGroom);

      return apiGet<{ horses: Horse[]; total: number }>(
        `/horses?${params.toString()}`
      );
    },
    enabled: !!yardId,
  });
}

export function useHorse(horseId?: string) {
  return useQuery<HorseDetail>({
    queryKey: ['horse', horseId],
    queryFn: async () => {
      return apiGet<HorseDetail>(`/horses/${horseId}`);
    },
    enabled: !!horseId,
  });
}

export function useCreateHorse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: unknown) => {
      return apiPost('/horses', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horses'] });
    },
  });
}

export function useUpdateHorse(horseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: unknown) => {
      return apiPatch(`/horses/${horseId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horse', horseId] });
      queryClient.invalidateQueries({ queryKey: ['horses'] });
    },
  });
}

export function useDeleteHorse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (horseId: string) => {
      return apiDelete(`/horses/${horseId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horses'] });
    },
  });
}
