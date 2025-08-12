// hooks/useCreateRole.ts
import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TeamsService } from '@/services/staffmanagment/teams/teams.service';

export const useCreateTeams = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TeamsService.useCreateTeams,
    onSuccess: (data) => {
      toast.success('Team created successfully');
      // Invalidate and refetch roles data
      //   queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create Team');
    },
  });
};
