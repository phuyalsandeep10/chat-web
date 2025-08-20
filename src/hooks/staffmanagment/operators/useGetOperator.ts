// hooks/useCreateRole.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Operatorservice } from '@/services/staffmanagment/operators/operator.service';

export const useGetOperator = () => {
  return useQuery({
    queryKey: ['operators'],
    queryFn: Operatorservice.GetOpertaors,
    meta: {
      onSuccess: (data: any) => {
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
