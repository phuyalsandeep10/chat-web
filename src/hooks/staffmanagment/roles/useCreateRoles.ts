// hooks/useCreateRole.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RolesService } from '@/services/staffmanagment/roles/roles.service';

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: RolesService.CreateRoles,
    onSuccess: (data) => {
      toast.success('Role created successfully');
      // Invalidate and refetch roles data
      queryClient.invalidateQueries({ queryKey: ['allRolePermissionGroup'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create role');
    },
  });
};
