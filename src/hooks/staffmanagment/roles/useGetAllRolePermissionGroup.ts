// hooks/useCreateRole.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RolesService } from '@/services/staffmanagment/roles/roles.service';

interface RolePermission {
  id: number;
  name: string;
  // add more fields as needed
}

interface RolePermissionGroupResponse {
  [key: string]: RolePermission[] | undefined;
}

export const useGetAllRolePermissionGroup = () => {
  return useQuery<RolePermissionGroupResponse, unknown>({
    queryKey: ['allRolePermissionGroup'],
    queryFn: RolesService.GetAllRolePermissionGroup,
    meta: {
      onSuccess: (data: RolePermissionGroupResponse) => {
        // toast.success('Get Set Permission Successfully'); // only in mutation method
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || 'Failed to get set permission',
        );
      },
    },
  });
};
