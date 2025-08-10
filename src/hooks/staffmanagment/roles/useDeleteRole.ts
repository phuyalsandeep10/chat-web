// hooks/useCreateRole.ts
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RolesService } from '@/services/staffmanagment/roles/roles.service';

export const useDeleteRole = () => {
  return useMutation({
    mutationFn: (role_id: string) => RolesService.DeleteRoles(role_id),
    onSuccess: (data) => {
      toast.success('Role Deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to Delete role');
    },
  });
};
