// hooks/useUpdateRoles.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Operatorservice } from '@/services/staffmanagment/operators/operator.service';

// types.ts (optional separate file)
type Role = {
  role_id: number;
  role_name: string;
};

type OperatorPayload = {
  created_at?: string;
  id?: number;
  user_name?: string;
  email?: string;
  role_ids?: number[];
  roles?: Role[];
  shift?: string;
  operating_hour?: string;
  client_handled?: string;
  start_time?: string;
  end_time?: string;
  total_hours?: number;
};

type EditOperatorVariables = {
  member_id: number | string;
  payload: OperatorPayload;
};

export const useEditOperator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ member_id, payload }: EditOperatorVariables) =>
      Operatorservice.EditOperators(member_id.toString(), payload), //here changed
    onSuccess: (data, variables, context) => {
      toast.success('Role updated successfully');
      // Invalidate and refetch roles data
      // queryClient.invalidateQueries({
      //   queryKey: ['operators'],
      // });
      queryClient.invalidateQueries({ queryKey: ['operators'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update role');
    },
  });
};
