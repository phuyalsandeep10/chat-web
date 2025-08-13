// hooks/useCreateRole.ts
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RolesService } from '@/services/staffmanagment/roles/roles.service';

// Define the expected data structure returned by the API
type RolePermission = { id: number; name: string };

export const useGetAllPermissionGroup = () => {
  return useQuery<RolePermission[]>({
    queryKey: ['getAllPermissionGroup'],

    queryFn: RolesService.GetAllPermissionGroup,
    meta: {
      onSuccess: (data: any) => {
        toast.success('Get Set Permission Successfully'); //data.message
        // queryClient.invalidateQueries({ queryKey: ['getAllPermissionGroup'] });
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || 'Failed to get set permission',
        );
      },
    },
  });
};
