// hooks/useDeleteRole.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Operatorservice } from '@/services/staffmanagment/operators/operator.service';

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (member_id: string) =>
      Operatorservice.DeleteOperators(member_id),
    onSuccess: (data) => {
      toast.success('Members deleted successfully');
      // Invalidate and refetch roles data
      //   queryClient.invalidateQueries({ queryKey: ['allRolePermissionGroup'] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to delete Invitation',
      );
    },
  });
};
