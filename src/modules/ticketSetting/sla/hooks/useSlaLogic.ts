'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSlaStore, useSla, useDeleteSla } from './useSla';
import { usePriorities } from '@/modules/ticket/hooks/usePriorities';
import { useAddSla } from './useAddSla';
import type { SLAFormData } from './useSlaAutoSave';

export const timeUnitOptions = [
  { value: 'Minutes', label: 'Minutes' },
  { value: 'Hours', label: 'Hours' },
  { value: 'Days', label: 'Days' },
];

export function secondsToHuman(seconds: number) {
  if (seconds < 3600)
    return { value: Math.round(seconds / 60), unit: 'Minutes' };
  if (seconds < 86400)
    return { value: Math.round(seconds / 3600), unit: 'Hours' };
  return { value: Math.round(seconds / 86400), unit: 'Days' };
}

export function capitalizeFirstLetter(text: string) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// ✅ Custom hook that encapsulates SLA logic
export function useSlaLogic() {
  const { data: slaData, isLoading } = useSla();
  const slaList = useSlaStore((state) => state.slaList);

  const { control, reset } = useForm<SLAFormData>({ defaultValues: {} });
  const { control: newSlaControl } = useAddSla(() => setShowNewRow(false));

  // States
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showNewRow, setShowNewRow] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const deleteMutation = useDeleteSla();
  const { data: priorities, isLoading: priorityLoading } = usePriorities();

  // Pre-fill form with SLA values
  useEffect(() => {
    if (!slaList?.length) return;

    const mappedDefaults: Record<string, any> = {};
    slaList.forEach((sla: any) => {
      const key = sla.priority?.name || `sla-${sla.id}`;
      const response = secondsToHuman(Number(sla.response_time ?? 0));
      const resolution = secondsToHuman(Number(sla.resolution_time ?? 0));

      mappedDefaults[`${key}_responseTime`] = response.value;
      mappedDefaults[`${key}_responseUnit`] = response.unit;
      mappedDefaults[`${key}_resolutionTime`] = resolution.value;
      mappedDefaults[`${key}_resolutionUnit`] = resolution.unit;
    });

    reset(mappedDefaults);
  }, [slaList, reset]);

  // Selection logic
  const toggleRowSelection = (id: number) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedRows(newSelection);
  };

  const handleCancel = () => setSelectedRows(new Set());

  const handleAddNewRow = () => setShowNewRow(true);

  const handleConfirmDelete = () => {
    selectedRows.forEach((id) => deleteMutation.mutate(id));
    setSelectedRows(new Set());
    setIsDeleteOpen(false);
  };

  const isAnySelected = selectedRows.size > 0;

  // Priority options (exclude already used ones)
  const usedPriorityIds = new Set(slaList.map((sla) => sla.priority?.id));
  const priorityOptions =
    priorities
      ?.filter((p: any) => !usedPriorityIds.has(p.id))
      .map((p: any) => ({ value: p.id, label: p.name })) || [];

  return {
    slaList,
    isLoading,
    control,
    newSlaControl,
    selectedRows,
    showNewRow,
    setShowNewRow,
    isDeleteOpen,
    setIsDeleteOpen,
    toggleRowSelection,
    handleCancel,
    handleAddNewRow,
    handleConfirmDelete,
    isAnySelected,
    priorityOptions,
    timeUnitOptions,
    capitalizeFirstLetter,
  };
}
