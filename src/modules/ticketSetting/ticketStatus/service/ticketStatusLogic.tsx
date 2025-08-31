import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { showToast } from '@/shared/toast';
import { useQueryClient } from '@tanstack/react-query';
import {
  TicketStatus as TicketStatusType,
  useTicketStatuses,
  addTicketStatus,
  deleteTicketStatus,
  updateTicketStatus,
} from './useTicketStatuses';
import { useDebounce } from './debounce';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// export interface FormData {
//   newStatusName: string;
//   newCategoryName: string;
// }

//  Zod schema for Add New Status
const addStatusSchema = z.object({
  newStatusName: z
    .string()
    .min(2, 'Status name must be at least 2 characters')
    .max(50, 'Status name must be less than 50 characters'),
  newCategoryName: z.string().nonempty('Please select a category'),
});

type FormData = z.infer<typeof addStatusSchema>;

export const useTicketStatusLogic = () => {
  const queryClient = useQueryClient();
  const { data: fetchedStatuses } = useTicketStatuses();
  const [statuses, setStatuses] = useState<TicketStatusType[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState<TicketStatusType | null>(
    null,
  );

  const [newStatusBgColor, setNewStatusBgColor] = useState('#000000');
  const [newStatusFgColor, setNewStatusFgColor] = useState('#ffffff');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addStatusSchema),
    defaultValues: { newStatusName: '', newCategoryName: '' },
  });

  const categoryOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'open', label: 'Open' },
    { value: 'closed', label: 'Closed' },
    { value: 'reopened', label: 'Reopened' },
  ];

  // Sync fetched statuses
  useEffect(() => {
    if (fetchedStatuses) setStatuses(fetchedStatuses);
  }, [fetchedStatuses]);

  // ---- API UPDATE (Debounced) ----
  const debouncedUpdate = useDebounce(
    async (id: string | number, updates: Partial<TicketStatusType>) => {
      try {
        const res = await updateTicketStatus(id, updates);
        queryClient.invalidateQueries({ queryKey: ['ticket-statuses'] });
        showToast({
          title: 'Updated',
          description: res?.message || 'Status updated successfully',
          variant: 'success',
        });
      } catch (error: any) {
        showToast({
          title: 'Error',
          description:
            error?.response?.data?.message ||
            error?.message ||
            'Failed to update',
          variant: 'error',
        });
      }
    },
    2000, // debounce delay
  );

  // Handlers for inline edits
  const handleNameChange = (id: string | number, value: string) => {
    setStatuses((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: value } : s)),
    );
    debouncedUpdate(id, { name: value });
  };

  const handleCategoryChange = (id: string | number, value: string) => {
    setStatuses((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status_category: value } : s)),
    );
    debouncedUpdate(id, { status_category: value });
  };

  const handleBackgroundColorChange = (id: string | number, color: string) => {
    setStatuses((prev) =>
      prev.map((s) => (s.id === id ? { ...s, bg_color: color } : s)),
    );
    debouncedUpdate(id, { bg_color: color });
  };

  const handleForegroundColorChange = (id: string | number, color: string) => {
    setStatuses((prev) =>
      prev.map((s) => (s.id === id ? { ...s, fg_color: color } : s)),
    );
    debouncedUpdate(id, { fg_color: color });
  };

  // Delete modal
  const handleOpenDeleteModal = (status: TicketStatusType) => {
    setStatusToDelete(status);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!statusToDelete) return;
    try {
      const res = await deleteTicketStatus(statusToDelete.id);
      setStatuses((prev) => prev.filter((s) => s.id !== statusToDelete.id));
      showToast({
        title: 'Deleted',
        description: res?.message || 'Status deleted successfully',
        variant: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['ticket-statuses'] });
    } catch (error: any) {
      showToast({
        title: 'Error',
        description:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to delete',
        variant: 'error',
      });
    } finally {
      setDeleteModalOpen(false);
      setStatusToDelete(null);
    }
  };

  // Add new status
  const handleAddStatus = async (data: FormData) => {
    if (data.newStatusName && data.newCategoryName) {
      const newStatus: Omit<TicketStatusType, 'id'> = {
        name: data.newStatusName,
        status_category: data.newCategoryName,
        bg_color: newStatusBgColor,
        fg_color: newStatusFgColor,
      };

      try {
        const addedStatus = await addTicketStatus(newStatus);
        setStatuses((prev) => [...prev, addedStatus]);
        reset();
        setNewStatusBgColor('#000000');
        setNewStatusFgColor('#ffffff');
        showToast({
          title: 'Added',
          description: addedStatus?.message || 'Status added successfully',
          variant: 'success',
        });
        queryClient.invalidateQueries({ queryKey: ['ticket-statuses'] });
      } catch (error: any) {
        showToast({
          title: 'Error',
          description:
            error?.response?.data?.message || error?.message || 'Failed to add',
          variant: 'error',
        });
      }
    }
  };

  return {
    statuses,
    setStatuses,
    deleteModalOpen,
    setDeleteModalOpen,
    statusToDelete,
    setStatusToDelete,
    newStatusBgColor,
    setNewStatusBgColor,
    newStatusFgColor,
    setNewStatusFgColor,
    control,
    handleSubmit,
    reset,
    errors,
    categoryOptions,
    handleOpenDeleteModal,
    handleConfirmDelete,
    handleAddStatus,
    handleBackgroundColorChange,
    handleForegroundColorChange,
    handleNameChange,
    handleCategoryChange,
  };
};
