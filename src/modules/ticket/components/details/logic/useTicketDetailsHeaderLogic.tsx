'use client';

import { useState, useEffect, useRef } from 'react';
import { getTicketDetails } from '@/services/ticket/services';
import { usePriorities } from '@/modules/ticket/hooks/usePriorities';
import {
  useTicketStatuses,
  TicketStatus,
} from '@/modules/ticket/hooks/useTicketStatus';
import axiosInstance from '@/apiConfigs/axiosInstance';
import { showToast } from '@/shared/toast';

// ---- DEBOUNCE HOOK ----
function useDebounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounced = (...args: Parameters<T>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fn(...args), delay);
  };
  return debounced as T;
}

// ---- PATCH APIs ----
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

// ---- HOOK ----
export const useTicketHeaderLogic = (ticketId: number) => {
  const [ticket, setTicket] = useState<any>(null);
  const [priorityId, setPriorityId] = useState('');
  const [statusId, setStatusId] = useState('');
  const [agent, setAgent] = useState('');
  const [assignees, setAssignees] = useState<{ name: string }[]>([]);

  const { data: priorities } = usePriorities();
  const { data: statuses } = useTicketStatuses();

  // Fetch ticket details
  useEffect(() => {
    if (!ticketId) return;

    const fetchTicket = async () => {
      try {
        const response = await getTicketDetails(ticketId);
        const data = response.data;

        setTicket(data);
        setPriorityId(data.priority?.id?.toString() || '');
        setStatusId(data.status?.id?.toString() || '');
        setAssignees(data.assignees || []);

        if (data.assignees?.length > 0) setAgent(data.assignees[0].name);
        else if (data.created_by) setAgent(data.created_by.name);
      } catch (err) {
        console.error('Failed to fetch ticket', err);
      }
    };

    fetchTicket();
  }, [ticketId]);

  // Debounced API calls
  const debouncedUpdatePriority = useDebounce(async (newPriorityId: string) => {
    if (!ticketId) return;
    try {
      const data = await updateTicketPriorityApi(ticketId, newPriorityId);
      showToast({
        title: 'Success',
        description: data?.message || 'Priority updated successfully!',
        variant: 'success',
      });
    } catch (err: any) {
      showToast({
        title: 'Error',
        description:
          err.response?.data?.message ||
          err.message ||
          'Failed to update priority',
        variant: 'error',
      });
    }
  }, 1000);

  const debouncedUpdateStatus = useDebounce(async (newStatusId: string) => {
    if (!ticketId) return;
    try {
      const data = await updateTicketStatusApi(ticketId, newStatusId);
      showToast({
        title: 'Success',
        description: data?.message || 'Status updated successfully!',
        variant: 'success',
      });
    } catch (err: any) {
      showToast({
        title: 'Error',
        description:
          err.response?.data?.message ||
          err.message ||
          'Failed to update status',
        variant: 'error',
      });
    }
  }, 1000);

  // Handlers
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
