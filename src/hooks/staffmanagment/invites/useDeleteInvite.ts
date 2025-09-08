// hooks/useDeleteRole.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { InviteService } from '@/services/staffmanagment/invites/invite.service';

export const useDeleteInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitation_id: string) =>
      InviteService.DeleteInvites(invitation_id),
    onSuccess: (data) => {
      toast.success('Invite deleted successfully');
      // Invalidate and refetch roles data
      //   queryClient.invalidateQueries({ queryKey: ['allRolePermissionGroup'] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to delete Invitation',
      );
    },
  });
};
