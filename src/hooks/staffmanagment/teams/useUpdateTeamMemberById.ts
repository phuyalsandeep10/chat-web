import { useMutation } from '@tanstack/react-query';
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
  return useMutation({
    mutationFn: ({ teamId, members }: UpdateTeamMembersPayload) =>
      TeamsService.updateTeamMembersById(teamId, members),
    onSuccess: () => {
      toast.success('Team members updated successfully');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to update team members',
      );
    },
  });
};
