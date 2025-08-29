// hooks/useCreateRole.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { InviteService } from '@/services/staffmanagment/invites/invite.service';

export const useInvites = () => {
  return useQuery({
    queryKey: ['invitedMembers'],
    queryFn: InviteService.InviteMember,
  });
};
