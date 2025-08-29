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
import { Control, FieldValues, Controller, Path } from 'react-hook-form';
import { SelectField } from '@/components/common/hook-form/SelectField';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronsUpDown } from 'lucide-react';

export type ModalFieldType = 'select' | 'multiselect';

type BaseFieldConfig<TForm extends FieldValues> = {
  name: Path<TForm>;
  label: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  required?: boolean;
};

type SelectFieldConfig<TForm extends FieldValues> = BaseFieldConfig<TForm> & {
  type: 'select';
};

type MultiSelectFieldConfig<TForm extends FieldValues> =
  BaseFieldConfig<TForm> & {
    type: 'multiselect';
    defaultValue?: string[];
  };

export type ModalFieldConfig<TForm extends FieldValues> =
  | SelectFieldConfig<TForm>
  | MultiSelectFieldConfig<TForm>;

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
            selectedItems.map((item: any) => (
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

        {fields.map((field) => {
          const fieldName = field.name as Path<TForm>;

          if (field.type === 'select') {
            return (
              <SelectField<TForm>
                key={fieldName}
                control={control}
                name={fieldName}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                options={field.options}
                LabelClassName="text-brand-dark font-outfit font-semibold text-sm"
              />
            );
          }

          if (field.type === 'multiselect') {
            const multi = field as MultiSelectFieldConfig<TForm>;
            return (
              <Controller
                key={fieldName}
                control={control}
                name={fieldName}
                defaultValue={multi.defaultValue ?? ([] as any)}
                render={({ field: rhfField }) => {
                  const selectedValues: string[] = Array.isArray(rhfField.value)
                    ? rhfField.value
                    : [];

                  const setSelected = (next: string[]) => {
                    rhfField.onChange(next);
                  };

                  const selectedLabels =
                    selectedValues.length > 0
                      ? field.options
                          .filter((opt) => selectedValues.includes(opt.value))
                          .map((opt) => opt.label)
                          .join(', ')
                      : '';

                  return (
                    <div className="flex flex-col space-y-1">
                      <label className="text-brand-dark font-outfit text-sm font-semibold">
                        {field.label}
                      </label>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {selectedLabels ||
                              field.placeholder ||
                              'Select options'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-[300px]">
                          <DropdownMenuLabel>{field.label}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {field.options.map((option) => {
                            const checked = selectedValues.includes(
                              option.value,
                            );
                            return (
                              <DropdownMenuCheckboxItem
                                key={option.value}
                                checked={checked}
                                onCheckedChange={(isChecked) => {
                                  if (isChecked) {
                                    setSelected([
                                      ...selectedValues,
                                      option.value,
                                    ]);
                                  } else {
                                    setSelected(
                                      selectedValues.filter(
                                        (v) => v !== option.value,
                                      ),
                                    );
                                  }
                                }}
                                className="cursor-pointer"
                              >
                                {option.label}
                              </DropdownMenuCheckboxItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                }}
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
