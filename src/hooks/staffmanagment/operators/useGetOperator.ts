import { queryClient } from '@/providers/query-provider';
// hooks/useCreateRole.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Operatorservice } from '@/services/staffmanagment/operators/operator.service';

export const useGetOperator = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['operators'],
    queryFn: Operatorservice.GetOpertaors,
    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ['operators'],
    //   });
    // },
  });
};
