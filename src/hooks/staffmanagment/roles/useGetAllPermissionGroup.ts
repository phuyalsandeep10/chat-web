// hooks/useCreateRole.ts
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RolesService } from '@/services/staffmanagment/roles/roles.service';

// Define the expected data structure returned by the API
type Permission = { id: number; name: string };

type PermissionGroupResponse = Record<string, Permission[]>;

export const useGetAllPermissionGroup = () => {
  return useQuery<PermissionGroupResponse>({
    queryKey: ['getAllPermissionGroup'],

    queryFn: RolesService.GetAllPermissionGroup,
    meta: {
      onSuccess: (data: PermissionGroupResponse) => {
        toast.success('Get Set Permission Successfully'); //data.message
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || 'Failed to get set permission',
        );
      },
    },
  });
};
