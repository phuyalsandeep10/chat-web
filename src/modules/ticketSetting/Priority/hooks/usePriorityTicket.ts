'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { usePriorities } from '@/modules/ticket/hooks/usePriorities';
import axiosInstance from '@/apiConfigs/axiosInstance';
import { showToast } from '@/shared/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePriorityStore } from '@/services/priority/usePriorityStore';

interface PriorityUI {
  id: string;
  name: string;
  bg_color: string;
  fg_color: string;
  level: number;
}

interface AddPriorityFormData {
  newPriorityName: string;
  level: string;
}

// ---- API CALLS ----
const deletePriorityApi = async (id: number) => {
  const response = await axiosInstance.delete(`/tickets/priority/${id}`);
  return response.data;
};

const addPriorityApi = async (priority: {
  name: string;
  level: number;
  bg_color: string;
  fg_color: string;
}) => {
  const response = await axiosInstance.post(`/tickets/priority`, [priority]);
  return response.data;
};

const updatePriorityApi = async (priority: PriorityUI) => {
  const { id, name, level, bg_color, fg_color } = priority;
  const response = await axiosInstance.patch(`/tickets/priority/${id}`, {
    id: Number(id),
    name,
    level,
    bg_color,
    fg_color,
  });
  return response.data;
};

// ---- CUSTOM DEBOUNCE HOOK ----
function useDebounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounced = (...args: Parameters<T>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fn(...args), delay);
  };

  return debounced as T;
}

export function capitalizeFirstLetter(text: string) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// ---- MAIN HOOK ----
export function usePrioritiesTicket() {
  const queryClient = useQueryClient();
  const setPrioritiesStore = usePriorityStore((state) => state.setPriorities);

  const [priorities, setPriorities] = useState<PriorityUI[]>([]);
  const [newPriorityBgColor, setNewPriorityBgColor] = useState('#000000');
  const [newPriorityTextColor, setNewPriorityTextColor] = useState('#ffffff');
  const [checkedPriority, setCheckedPriority] = useState<
    Record<number, boolean>
  >({});
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm<AddPriorityFormData>({
    defaultValues: { newPriorityName: '', level: '' },
  });

  const { data, isLoading, isError, error } = usePriorities();

  useEffect(() => {
    if (data) {
      const formattedStore = data.map((p: any) => ({
        id: Number(p.id),
        name: p.name,
        bg_color: p.bg_color,
        fg_color: p.fg_color,
        level: p.level,
      }));

      const formattedUI: PriorityUI[] = formattedStore.map((p) => ({
        id: String(p.id),
        name: p.name,
        bg_color: p.bg_color,
        fg_color: p.fg_color,
        level: p.level,
      }));

      setPriorities(formattedUI);
      setPrioritiesStore(formattedStore);
    }
  }, [data, setPrioritiesStore]);

  const levelOptions = (() => {
    const usedLevels = new Set(priorities.map((p) => String(p.level)));
    return Array.from({ length: 11 }, (_, i) => ({
      value: String(i),
      label: String(i),
    })).filter((option) => !usedLevels.has(option.value));
  })();

  // ---- UPDATE MUTATION ----
  const { mutate: updatePriorityMutation, isPending: isUpdating } = useMutation(
    {
      mutationFn: updatePriorityApi,
      onSuccess: (data: any) => {
        showToast({
          title: 'Success',
          description: data?.message || 'Priority updated successfully!',
          variant: 'success',
        });
        queryClient.invalidateQueries({ queryKey: ['priorities'] });
      },
      onError: (err: any) => {
        showToast({
          title: 'Update Failed',
          description:
            err.response?.data?.message ||
            err.message ||
            'Failed to update priority',
          variant: 'error',
        });
      },
    },
  );

  const debouncedUpdate = useDebounce((priority: PriorityUI) => {
    updatePriorityMutation(priority);
  }, 1000);

  // ---- UPDATE FUNCTIONS ----
  const updatePriorityName = (id: string, newName: string) => {
    const updatedPriority = priorities.find((p) => p.id === id);
    if (!updatedPriority) return;
    const updated = { ...updatedPriority, name: newName };
    setPriorities((prev) => prev.map((p) => (p.id === id ? updated : p)));
    debouncedUpdate(updated);
  };

  const updatePriorityColor = (
    id: string,
    type: 'bg' | 'fg',
    color: string,
  ) => {
    const updatedPriority = priorities.find((p) => p.id === id);
    if (!updatedPriority) return;
    const updated = {
      ...updatedPriority,
      [type === 'bg' ? 'bg_color' : 'fg_color']: color,
    };
    setPriorities((prev) => prev.map((p) => (p.id === id ? updated : p)));
    debouncedUpdate(updated);
  };

  const updatePriorityLevel = (id: string, level: number) => {
    const updatedPriority = priorities.find((p) => p.id === id);
    if (!updatedPriority) return;
    const updated = { ...updatedPriority, level };
    setPriorities((prev) => prev.map((p) => (p.id === id ? updated : p)));
    debouncedUpdate(updated);
  };

  // ---- ADD PRIORITY ----
  const { mutate: addPriority, isPending: isAdding } = useMutation({
    mutationFn: (formData: AddPriorityFormData) =>
      addPriorityApi({
        name: formData.newPriorityName,
        level: Number(formData.level),
        bg_color: newPriorityBgColor,
        fg_color: newPriorityTextColor,
      }),
    onSuccess: (data: any) => {
      showToast({
        title: 'Success',
        description:
          data?.message || 'The new priority has been successfully created.',
        variant: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['priorities'] });
      reset();
      setNewPriorityBgColor('#000000');
      setNewPriorityTextColor('#ffffff');
    },
    onError: (err: any) => {
      showToast({
        title: 'Error',
        description:
          err.response?.data?.message ||
          err.message ||
          'Failed to add priority',
        variant: 'error',
      });
    },
  });

  const onAddPriority = (formData: AddPriorityFormData) => {
    if (!formData.newPriorityName.trim()) {
      showToast({
        title: 'Validation Error',
        description: 'Priority name is required',
        variant: 'error',
      });
      return;
    }
    addPriority(formData);
  };

  // ---- DELETE ----
  const { mutate: deletePriorities, isPending: isDeleting } = useMutation({
    mutationFn: async (ids: number[]) => {
      const responses = await Promise.all(ids.map(deletePriorityApi));
      return responses;
    },
    onSuccess: (responses: any) => {
      // Show message from first API response if available
      const message =
        responses[0]?.message || 'Selected priorities deleted successfully';
      showToast({
        title: 'Deleted',
        description: message,
        variant: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['priorities'] });
      setCheckedPriority({});
      setDeleteModalOpen(false);
    },
    onError: (err: any) => {
      showToast({
        title: 'Error',
        description:
          err.response?.data?.message ||
          err.message ||
          'Failed to delete priority(s)',
        variant: 'error',
      });
    },
  });

  const selectedIds = Object.entries(checkedPriority)
    .filter(([_, checked]) => checked)
    .map(([id]) => Number(id));

  const handleCheckChange = (id: number, isChecked: boolean) => {
    setCheckedPriority((prev) => ({ ...prev, [id]: isChecked }));
  };

  const handleConfirmDelete = () => {
    if (selectedIds.length > 0) deletePriorities(selectedIds);
  };

  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  return {
    priorities,
    control,
    handleSubmit,
    reset,
    newPriorityBgColor,
    newPriorityTextColor,
    setNewPriorityBgColor,
    setNewPriorityTextColor,
    levelOptions,
    updatePriorityName,
    updatePriorityColor,
    updatePriorityLevel,
    onAddPriority,
    isAdding,
    isLoading,
    isError,
    error,
    checkedPriority,
    handleCheckChange,
    selectedIds,
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    deletePriorities,
    isDeleting,
    isUpdating,
    capitalizeFirstLetter,
  };
}
