// hooks/useDeleteRole.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TeamsService } from '@/services/staffmanagment/teams/teams.service';

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (team_id: string) => TeamsService.DeleteTeams(team_id),
    onSuccess: (data) => {
      toast.success('Teams deleted successfully');
      // Invalidate and refetch roles data
      //   queryClient.invalidateQueries({ queryKey: ['allRolePermissionGroup'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete Teams');
    },
  });
};
