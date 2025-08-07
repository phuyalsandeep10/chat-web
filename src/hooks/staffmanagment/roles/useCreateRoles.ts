// hooks/useCreateRole.ts
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RolesService } from '@/services/staffmanagment/roles/roles.service';

export const useCreateRole = () => {
  return useMutation({
    mutationFn: RolesService.CreateRoles,
    onSuccess: (data) => {
      toast.success('Role created successfully');
      // Optional: refetch roles or close modal here
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create role');
    },
  });
};
