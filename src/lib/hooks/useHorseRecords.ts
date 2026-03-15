import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPost, apiPatch, apiDelete } from '@/lib/client';

// Medical History
export function useCreateMedicalHistory(horseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: unknown) => {
      console.log('Mutation: Creating medical history for horse:', horseId, 'Data:', data);
      try {
        const result = await apiPost(`/horses/${horseId}/medical`, data);
        console.log('Mutation: Success', result);
        return result;
      } catch (error) {
        console.error('Mutation: Error', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Invalidating query for horse:', horseId);
      queryClient.invalidateQueries({ queryKey: ['horse', horseId] });
    },
    onError: (error: unknown) => {
      console.error('Mutation error:', (error as { message?: string })?.message);
    },
  });
}

export function useUpdateMedicalHistory(horseId: string, recordId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, unknown>({
    mutationFn: async (data: unknown) => {
      return apiPatch(`/horses/${horseId}/medical/${recordId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horse', horseId] });
    },
  });
}

export function useDeleteMedicalHistory(horseId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: async (recordId: string) => {
      return apiDelete(`/horses/${horseId}/medical/${recordId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horse', horseId] });
    },
  });
}

// Vaccinations
export function useCreateVaccination(horseId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, unknown>({
    mutationFn: async (data: unknown) => {
      return apiPost(`/horses/${horseId}/vaccinations`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horse', horseId] });
    },
  });
}

export function useUpdateVaccination(horseId: string, recordId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, unknown>({
    mutationFn: async (data: unknown) => {
      return apiPatch(`/horses/${horseId}/vaccinations/${recordId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horse', horseId] });
    },
  });
}

export function useDeleteVaccination(horseId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: async (recordId: string) => {
      return apiDelete(`/horses/${horseId}/vaccinations/${recordId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horse', horseId] });
    },
  });
}

// Notes
export function useCreateNote(horseId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, unknown>({
    mutationFn: async (data: unknown) => {
      return apiPost(`/horses/${horseId}/notes`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horse', horseId] });
    },
  });
}

export function useUpdateNote(horseId: string, recordId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, unknown>({
    mutationFn: async (data: unknown) => {
      return apiPatch(`/horses/${horseId}/notes/${recordId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horse', horseId] });
    },
  });
}

export function useDeleteNote(horseId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: async (recordId: string) => {
      return apiDelete(`/horses/${horseId}/notes/${recordId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horse', horseId] });
    },
  });
}

// Tasks
export function useCreateTask(horseId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, unknown>({
    mutationFn: async (data: unknown) => {
      return apiPost(`/horses/${horseId}/tasks`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horse', horseId] });
    },
  });
}

export function useUpdateTask(horseId: string, recordId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, unknown>({
    mutationFn: async (data: unknown) => {
      return apiPatch(`/horses/${horseId}/tasks/${recordId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horse', horseId] });
    },
  });
}

export function useDeleteTask(horseId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: async (recordId: string) => {
      return apiDelete(`/horses/${horseId}/tasks/${recordId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horse', horseId] });
    },
  });
}
