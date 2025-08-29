import { queryClient } from '@/providers/query-provider';
// hooks/useCreateRole.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TeamsService } from '@/services/staffmanagment/teams/teams.service';

export const useGetTeams = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['getAllTeams'],
    queryFn: TeamsService.GetTeams,
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['getAllTeams'] });
    // },
  });
};
