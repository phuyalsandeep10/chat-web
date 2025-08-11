// hooks/useUpdateRoles.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RolesService } from '@/services/staffmanagment/roles/roles.service';

export const useUpdateRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ role_id, payload }: { role_id: string; payload: any }) =>
      RolesService.UpdateRoles(role_id, payload),
    onSuccess: (data) => {
      toast.success('Role updated successfully');
      // Invalidate and refetch roles data
      queryClient.invalidateQueries({ queryKey: ['allRolePermissionGroup'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update role');
    },
  });
};
