// hooks/useDeleteRole.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RolesService } from '@/services/staffmanagment/roles/roles.service';

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (role_id: string) => RolesService.DeleteRoles(role_id),
    onSuccess: (data) => {
      toast.success('Role deleted successfully');
      // Invalidate and refetch roles data
      queryClient.invalidateQueries({ queryKey: ['allRolePermissionGroup'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete role');
    },
  });
};
