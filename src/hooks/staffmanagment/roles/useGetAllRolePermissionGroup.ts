// hooks/useCreateRole.ts
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RolesService } from '@/services/staffmanagment/roles/roles.service';

export const useGetAllRolePermissionGroup = () => {
  return useQuery({
    queryKey: ['allRolePermissionGroup'],
    queryFn: RolesService.GetAllRolePermissionGroup,
    onSuccess: (data) => {
      toast.success('Get Set Permission Successfully');
      // Optional: refetch roles or close modal here
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to get set permission',
      );
    },
  });
};
