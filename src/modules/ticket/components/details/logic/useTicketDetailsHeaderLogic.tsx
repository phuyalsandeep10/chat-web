'use client';

import { useState, useEffect, useRef } from 'react';
import { getTicketDetails } from '@/services/ticket/services';
import { usePriorities } from '@/modules/ticket/hooks/usePriorities';
import { useTicketStatuses } from '@/modules/ticket/hooks/useTicketStatus';
import axiosInstance from '@/apiConfigs/axiosInstance';
import { showToast } from '@/shared/toast';

export interface Note {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
}

// ------------------ DEBOUNCE HOOK ------------------
function useDebounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounced = (...args: Parameters<T>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fn(...args), delay);
  };
  return debounced as T;
}

// ------------------ PATCH APIs ------------------
const updateTicketPriorityApi = async (
  ticketId: number,
  priorityId: string,
) => {
  const response = await axiosInstance.patch(`/tickets/${ticketId}`, {
    priority_id: priorityId,
  });
  return response.data;
};

const updateTicketStatusApi = async (ticketId: number, statusId: string) => {
  const response = await axiosInstance.patch(`/tickets/${ticketId}`, {
    status_id: statusId,
  });
  return response.data;
};

// ------------------ HOOK ------------------
export const useTicketHeaderLogic = (
  ticketId: number,
  onUpdateTicket?: (updated: any) => void,
) => {
  const [ticket, setTicket] = useState<any>(null);
  const [priorityId, setPriorityId] = useState('');
  const [statusId, setStatusId] = useState('');
  const [agent, setAgent] = useState('');
  const [assignees, setAssignees] = useState<{ name: string }[]>([]);

  const { data: priorities } = usePriorities();
  const { data: statuses } = useTicketStatuses();

  // Fetch ticket
  const fetchTicket = async () => {
    if (!ticketId) return;
    try {
      const response = await getTicketDetails(ticketId);
      const data = response.data;

      setTicket(data);
      setPriorityId(data.priority?.id?.toString() || '');
      setStatusId(data.status?.id?.toString() || '');
      setAssignees(data.assignees || []);
      setAgent(data.assignees?.[0]?.name || data.created_by?.name || '');

      onUpdateTicket?.(data);
    } catch (err) {
      console.error('Failed to fetch ticket', err);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  // Debounced PATCH functions
  const debouncedUpdatePriority = useDebounce(async (newPriorityId: string) => {
    if (!ticketId) return;
    try {
      await updateTicketPriorityApi(ticketId, newPriorityId);
      const updated = await getTicketDetails(ticketId);
      setTicket(updated.data);
      setPriorityId(updated.data.priority?.id?.toString() || '');
      onUpdateTicket?.(updated.data);
      showToast({
        title: 'Success',
        description: 'Priority updated!',
        variant: 'success',
      });
    } catch (err: any) {
      showToast({
        title: 'Error',
        description: err?.response?.data?.message || err.message,
        variant: 'error',
      });
    }
  }, 1000);

  const debouncedUpdateStatus = useDebounce(async (newStatusId: string) => {
    if (!ticketId) return;
    try {
      await updateTicketStatusApi(ticketId, newStatusId);
      const updated = await getTicketDetails(ticketId);
      setTicket(updated.data);
      setStatusId(updated.data.status?.id?.toString() || '');
      onUpdateTicket?.(updated.data);
      showToast({
        title: 'Success',
        description: 'Status updated!',
        variant: 'success',
      });
    } catch (err: any) {
      showToast({
        title: 'Error',
        description: err?.response?.data?.message || err.message,
        variant: 'error',
      });
    }
  }, 1000);

  const handlePriorityChange = (value: string) => {
    setPriorityId(value);
    debouncedUpdatePriority(value);
  };

  const handleStatusChange = (value: string) => {
    setStatusId(value);
    debouncedUpdateStatus(value);
  };

  return {
    ticket,
    priorityId,
    statusId,
    agent,
    assignees,
    priorities,
    statuses,
    setAgent,
    handlePriorityChange,
    handleStatusChange,
  };
};
