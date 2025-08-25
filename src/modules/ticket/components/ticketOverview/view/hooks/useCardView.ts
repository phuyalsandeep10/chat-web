import { useState, useMemo } from 'react';
import { TicketCardProps } from '@/modules/ticket/types/type';
import { useTicketStatuses } from '@/modules/ticket/hooks/useTicketStatus';
import { useTickets } from '@/modules/ticket/hooks/getApi/useTicket';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/apiConfigs/axiosInstance';
import { showToast } from '@/shared/toast';

//delete ticket
const deleteTicket = async (id: number) => {
  const response = await axiosInstance.delete(`/tickets/${id}`, {
    data: { id },
  });
  return response.data;
};

export function useCardView() {
  const queryClient = useQueryClient();

  // Load ticket statuses
  const {
    data: statuses = [],
    isLoading: statusLoading,
    error: statusError,
  } = useTicketStatuses();

  // Selected status tab
  const [selectedStatus, setSelectedStatus] =
    useState<TicketCardProps['status']>('ALL');

  // Map status name to ID
  const statusMap = useMemo(() => {
    const map: Record<string, number> = {};
    statuses.forEach((s) => {
      map[s.name] = s.id;
    });
    return map;
  }, [statuses]);

  const selectedStatusId =
    selectedStatus === 'ALL' ? undefined : statusMap[selectedStatus];

  // Fetch tickets based on selected status
  const {
    data: tickets = [],
    isLoading: ticketsLoading,
    error: ticketsError,
  } = useTickets(selectedStatusId);

  // Checkbox state for selected tickets
  const [checkedTickets, setCheckedTickets] = useState<Record<number, boolean>>(
    {},
  );

  const handleCheckChange = (id: number, isChecked: boolean) => {
    setCheckedTickets((prev) => ({
      ...prev,
      [id]: isChecked,
    }));
  };

  // Format date to "time ago"
  function formatTimeAgo(dateStr: string) {
    const dateUtc = new Date(dateStr);

    // Current UTC time
    const nowUtc = new Date(
      Date.now() + new Date().getTimezoneOffset() * 60 * 1000,
    );

    const diffMs = nowUtc.getTime() - dateUtc.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMinutes > 0) return `${diffMinutes}m ago`;
    return `${diffSeconds}s ago`;
  }

  // Get selected ticket IDs and ticket data
  const selectedTicketIds = Object.entries(checkedTickets)
    .filter(([_, checked]) => checked)
    .map(([id]) => Number(id));

  const selectedTickets = tickets.filter((t) =>
    selectedTicketIds.includes(t.id),
  );

  const deleteTicketName = selectedTickets.length
    ? selectedTickets[0].title
    : '';

  const selectedCountInCurrentTab = selectedTickets.length;

  // Delete modal state
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  // React Query mutation for deleting tickets
  const { mutate: deleteTickets, isPending: isDeleting } = useMutation({
    mutationFn: async (ids: number[]) => {
      const responses = await Promise.all(ids.map((id) => deleteTicket(id)));
      return responses; // Return API responses for use in onSuccess
    },
    onSuccess: (responses: any) => {
      // If API returns a message for each deleted ticket
      const messages = responses.map((res: any) => res.message).join(', ');

      showToast({
        title: 'Deleted',
        description: messages || 'Ticket(s) deleted successfully',
        variant: 'success',
      });

      queryClient.invalidateQueries({ queryKey: ['tickets'], exact: false });
      setCheckedTickets({});
      closeDeleteModal();
    },
    onError: (err: any) => {
      // If Axios error, extract message from response
      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to delete ticket(s)';

      showToast({
        title: 'Error',
        description: message,
        variant: 'error',
      });
    },
  });

  const handleConfirmDelete = () => {
    if (selectedTicketIds.length > 0) {
      deleteTickets(selectedTicketIds);
    }
  };

  // Tabs for status filtering
  const tabs = [
    { label: 'ALL', status: 'ALL' as TicketCardProps['status'] },
    ...statuses.map((s) => ({
      label: s.name,
      status: s.name as TicketCardProps['status'],
    })),
  ];

  return {
    // Loading and error states
    statusLoading,
    statusError,
    ticketsLoading,
    ticketsError,

    // Tickets and filtering
    tickets,
    selectedStatus,
    setSelectedStatus,
    tabs,

    // Selection states and handlers
    checkedTickets,
    handleCheckChange,
    selectedCountInCurrentTab,

    // Delete modal states and handlers
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
    deleteTicketName,
    handleConfirmDelete,
    isDeleting,

    // Utilities
    formatTimeAgo,
  };
}
