// hooks/useCreateRole.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { InviteService } from '@/services/staffmanagment/invites/invite.service';

export const useInvites = () => {
  return useQuery({
    queryKey: ['invitedMembers'],
    queryFn: InviteService.InviteMember,
    meta: {
      onSuccess: (data: any) => {
        // toast.success('Get Set Permission Successfully'); // only in mutation method
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || 'Failed to get set permission',
        );
      },
    },
  });
};
