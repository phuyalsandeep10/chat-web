// hooks/useCreateRole.ts
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RolesService } from '@/services/staffmanagment/roles/roles.service';

export const useUpdateRoles = () => {
  return useMutation({
    mutationFn: ({ role_id, payload }: { role_id: string; payload: any }) =>
      RolesService.UpdateRoles(role_id, payload),
    onSuccess: (data) => {
      toast.success('Role Updated successfully');

      // Optional: refetch roles or close modal here
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to Updated role');
    },
  });
};
