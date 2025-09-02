import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TeamsService } from '@/services/staffmanagment/teams/teams.service';

interface MemberAccess {
  member_id: number;
  access_level: string;
}

interface UpdateTeamMembersPayload {
  teamId: number;
  members: MemberAccess[];
}

export const useUpdateTeamMembersById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, members }: UpdateTeamMembersPayload) =>
      TeamsService.updateTeamMembersById(teamId, members),
    onSuccess: (_, variables) => {
      toast.success('Team members updated successfully');
      {
        queryClient.invalidateQueries({
          queryKey: ['teamMembersById', variables.teamId],
        });
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.data || 'Failed to update team members',
      );
    },
  });
};
