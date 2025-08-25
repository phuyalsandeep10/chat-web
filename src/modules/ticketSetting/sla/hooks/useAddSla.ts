'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/apiConfigs/axiosInstance';
import { showToast } from '@/shared/toast';

export interface NewSLAFormData {
  new_sla_name: string;
  new_sla_priority: string;
  new_sla_responseTime: string | number;
  new_sla_responseUnit: string;
  new_sla_resolutionTime: string | number;
  new_sla_resolutionUnit: string;
}

function humanToSeconds(value: number, unit: string) {
  switch (unit) {
    case 'Minutes':
      return value * 60;
    case 'Hours':
      return value * 3600;
    case 'Days':
      return value * 86400;
    default:
      return value;
  }
}

// Debounce hook
function useDebounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  return ((...args: Parameters<T>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fn(...args), delay);
  }) as T;
}

export function useAddSla(onSuccessCallback?: () => void) {
  const { control, watch, getValues, reset } = useForm<NewSLAFormData>({
    defaultValues: {
      new_sla_name: '',
      new_sla_priority: '',
      new_sla_responseTime: '',
      new_sla_responseUnit: 'Minutes',
      new_sla_resolutionTime: '',
      new_sla_resolutionUnit: 'Minutes',
    },
  });

  const queryClient = useQueryClient();

  const createSlaMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await axiosInstance.post('/tickets/sla', payload);
      return res.data;
    },
    onSuccess: (data) => {
      showToast({
        title: 'Success',
        description: data?.message || 'SLA created successfully!',
        variant: 'success',
      });

      // Refresh SLA list
      queryClient.invalidateQueries({ queryKey: ['sla'] });

      // Reset form
      reset();

      // Close the new row
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      showToast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to create SLA',
        variant: 'error',
      });
    },
  });

  const saveDebounced = useDebounce((payload: any) => {
    createSlaMutation.mutate(payload);
  }, 1500);

  useEffect(() => {
    const subscription = watch(() => {
      const values = getValues();

      const isFilled =
        values.new_sla_name?.trim() &&
        values.new_sla_priority &&
        values.new_sla_responseTime &&
        values.new_sla_responseUnit &&
        values.new_sla_resolutionTime &&
        values.new_sla_resolutionUnit;

      if (!isFilled) return;

      const payload = {
        name: values.new_sla_name.trim(),
        priority_id: Number(values.new_sla_priority),
        response_time: humanToSeconds(
          Number(values.new_sla_responseTime),
          values.new_sla_responseUnit,
        ),
        resolution_time: humanToSeconds(
          Number(values.new_sla_resolutionTime),
          values.new_sla_resolutionUnit,
        ),
      };

      saveDebounced(payload);
    });

    return () => subscription.unsubscribe();
  }, [watch, getValues, saveDebounced]);

  return { control, createSlaMutation };
}
