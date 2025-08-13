// hooks/useCreateRole.ts
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TeamsService } from '@/services/staffmanagment/teams/teams.service';

export const useGetTeams = () => {
  return useQuery({
    queryKey: ['getAllTeams'],
    queryFn: TeamsService.GetTeams,
    meta: {
      onSuccess: (data: any) => {
        toast.success('Get all teams'); //data.message
        // queryClient.invalidateQueries({ queryKey: ['getAllPermissionGroup'] });F
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || 'Failed to get all teams',
        );
      },
    },
  });
};
