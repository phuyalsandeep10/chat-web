import axiosInstance from '@/apiConfigs/axiosInstance';
import { create } from 'zustand';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

// Types
export type TicketStatus = {
  id: string | number;
  name: string;
  status_category: 'open' | 'closed' | 'pending' | string;
  bg_color: string;
  fg_color: string;
  is_default?: boolean;
};

// Zustand store
type TicketStatusState = {
  statuses: TicketStatus[];
  setStatuses: (data: TicketStatus[]) => void;
};

export const useTicketStatusStore = create<TicketStatusState>((set) => ({
  statuses: [],
  setStatuses: (data) => set({ statuses: data }),
}));

// Fetch ticket statuses
export const useTicketStatuses = () => {
  const setStatuses = useTicketStatusStore((state) => state.setStatuses);

  const query = useQuery<TicketStatus[], Error>({
    queryKey: ['ticket-statuses'],
    queryFn: async () => {
      const res = await axiosInstance.get('/tickets/status');
      return res.data.data as TicketStatus[];
    },
  });

  // Sync Zustand store
  useEffect(() => {
    if (query.data) setStatuses(query.data);
  }, [query.data, setStatuses]);

  return query;
};

// ---- Add new status ----
export const addTicketStatus = async (status: Omit<TicketStatus, 'id'>) => {
  try {
    const res = await axiosInstance.post('/tickets/status', [status]);
    const addedStatus = Array.isArray(res.data.data)
      ? res.data.data[0]
      : res.data.data;
    return addedStatus;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

// ---- Delete status ----
export const deleteTicketStatus = async (id: string | number) => {
  try {
    const res = await axiosInstance.delete(`/tickets/status/${id}`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

// ---- Update status ----
export const updateTicketStatus = async (
  id: string | number,
  updates: Partial<TicketStatus>,
) => {
  try {
    const res = await axiosInstance.patch(`/tickets/status/${id}`, updates);
    return res.data.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};
