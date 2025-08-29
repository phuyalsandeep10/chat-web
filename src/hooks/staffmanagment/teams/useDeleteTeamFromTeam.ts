import { queryClient } from '@/providers/query-provider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TeamsService } from '@/services/staffmanagment/teams/teams.service';

type DeleteTeamProps = {
  team_id: number;
  member_id: number;
};

export const useDeleteTeamFromTeam = () => {
  return useMutation({
    mutationFn: ({ team_id, member_id }: DeleteTeamProps) =>
      TeamsService.deleteMemberFromTeam(team_id, member_id),
    onSuccess: (_, variables) => {
      toast.success('Member removed from team successfully');
      queryClient.invalidateQueries({
        queryKey: ['teamMembersById', variables.team_id], // include the dynamic teamId
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to remove member from team',
      );
    },
  });
};
