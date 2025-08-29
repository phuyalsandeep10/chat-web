import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RolesService } from '@/services/staffmanagment/roles/roles.service';

export const useGetAllRolesPermissionsForEdit = () => {
  return useMutation({
    mutationFn: ({ role_id }: { role_id: string }) =>
      RolesService.getAllPermissionsForEdit(role_id),
    onSuccess: (data) => {
      // toast.success('Role Fetcheds for update  successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update role');
    },
  });
};
