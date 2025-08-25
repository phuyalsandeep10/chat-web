// useSla.ts
import { create } from 'zustand';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/apiConfigs/axiosInstance';
import { showToast } from '@/shared/toast';

type PriorityData = {
  created_at: string;
  name: string;
  resolution_time: number;
  id: number;
  response_time: number;
  priority_id: number | null;
  priority: {
    level: number;
    fg_color: string;
    id: number;
    name: string;
    bg_color: string;
  } | null;
};

type SlaState = {
  slaList: PriorityData[];
  setSlaList: (data: PriorityData[]) => void;
};

export const useSlaStore = create<SlaState>((set) => ({
  slaList: [],
  setSlaList: (data) => set({ slaList: data }),
}));

// Fetch SLA list
export const useSla = () => {
  const setSlaList = useSlaStore((state) => state.setSlaList);

  return useQuery({
    queryKey: ['sla'],
    queryFn: async () => {
      const res = await axiosInstance.get('/tickets/sla');
      setSlaList(res.data.data);
      return res.data.data as PriorityData[];
    },
  });
};

// ---- Delete SLA ----
export const useDeleteSla = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.delete(`/tickets/sla/${id}`);
      return res.data; // return response so we can show message
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sla'] });

      // Show success toast
      showToast({
        title: 'Deleted',
        description: data?.message || 'SLA deleted successfully',
        variant: 'success',
        position: 'top-right',
      });
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        'Failed to delete SLA. Please try again.';

      // Show error toast
      showToast({
        title: 'Error',
        description: msg,
        variant: 'error',
        position: 'top-right',
      });
    },
  });
};
