// hooks/useCreateRole.ts
import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TeamsService } from '@/services/staffmanagment/teams/teams.service';

export const useInvitesMembers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TeamsService.InviteTeams,
    onSuccess: (data) => {
      toast.success('Member Invited successfully');
      // Invalidate and refetch roles data
      //   queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to Invite Member');
    },
  });
};
