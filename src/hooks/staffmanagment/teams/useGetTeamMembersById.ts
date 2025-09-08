import { Team } from './../../../services/teams/team';
// hooks/useCreateRole.ts
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TeamsService } from '@/services/staffmanagment/teams/teams.service';

type TeamMember = {
  member_id: number;
  username: string;
  access_levels: string;
};

type TeamMembersByIdResponse = {
  data: TeamMember[];
};

export const useGetTeamMembersById = (teamId?: number) => {
  return useQuery<TeamMembersByIdResponse, Error>({
    queryKey: ['teamMembersById', teamId],
    queryFn: () => {
      if (!teamId) return { data: [] };
      return TeamsService.getTeamMembersById(teamId);
    },
    enabled: !!teamId, // React Query will not run the query until teamId is truthy
  });
};
