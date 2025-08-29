'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Control, FieldValues } from 'react-hook-form';
import { SelectField } from '@/components/common/hook-form/SelectField';
import { MultiSelectField } from '@/components/common/hook-form/MultipleSelect';

export type ModalFieldType = 'select' | 'multiselect';

export interface ModalFieldConfig<TForm extends FieldValues> {
  type: ModalFieldType;
  name: keyof TForm;
  label: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  required?: boolean;
  defaultValue?: string | string[];
}

interface ReusableAssignModalProps<TForm extends FieldValues> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItems: any[];
  control: Control<TForm>;
  fields: ModalFieldConfig<TForm>[];
  onSubmit: () => void;
  disabled?: boolean;
}

export function ReusableAssignModal<TForm extends FieldValues>({
  open,
  onOpenChange,
  selectedItems,
  control,
  fields,
  onSubmit,
  disabled = false,
}: ReusableAssignModalProps<TForm>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Items</DialogTitle>
          <DialogDescription>
            Choose options for the selected items.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-2">
          {selectedItems.length > 0 ? (
            selectedItems.map((item) => (
              <div
                key={item.id}
                className="rounded-md border border-gray-200 p-2 text-sm"
              >
                {item.title || item.name || item.label}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No items selected.</p>
          )}
        </div>

        {/* Render fields dynamically */}
        {fields.map((field) => {
          const fieldName = String(field.name); // cast to string

          if (field.type === 'select') {
            return (
              <SelectField<TForm>
                key={fieldName}
                control={control}
                name={fieldName as any} // react-hook-form expects string | Path<TForm>
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                options={field.options}
                LabelClassName="text-brand-dark font-outfit font-semibold text-sm"
              />
            );
          }

          if (field.type === 'multiselect') {
            return (
              <MultiSelectField
                key={fieldName}
                control={control}
                name={fieldName as any} // cast to string | Path<TForm>
                label={field.label}
                placeholder={field.placeholder}
                options={field.options}
                LabelClassName="text-brand-dark font-outfit font-semibold text-sm"
              />
            );
          }

          return null;
        })}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={disabled || selectedItems.length === 0}
          >
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
