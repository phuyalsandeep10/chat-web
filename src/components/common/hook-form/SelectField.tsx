'use client';

import React from 'react';
import {
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import Label from './Label';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Select } from '@radix-ui/react-select';

type SelectFieldProps<T extends FieldValues> = {
  control?: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  options: { value: string; label: string | null }[];
  placeholder?: string;
  className?: string;
  colorMap?: Record<string, string>;
  LabelClassName?: string;
  placeholderClassName?: string;
  isMulti?: boolean;
};

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  options,
  placeholder = 'Select an option',
  className = '',
  colorMap,
  LabelClassName = '',
  placeholderClassName,
  isMulti = false,
}: SelectFieldProps<T>) {
  return (
    <div className={cn('flex w-full flex-col', className)}>
      {label && (
        <Label
          htmlFor={name}
          required={required}
          className={cn(`!mb-1.5 !p-0 text-sm font-medium ${LabelClassName}`)}
        >
          {label}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const selectedValues: string[] = isMulti
            ? Array.isArray(field.value)
              ? field.value
              : []
            : [field.value].filter(Boolean);

          const handleDeselect = (val: string) => {
            if (!isMulti) return;
            const currentValues: string[] = Array.isArray(field.value)
              ? field.value
              : [];
            const newValues = currentValues.filter((v) => v !== val);
            field.onChange(newValues);
          };

          return (
            <>
              <Select
                value={isMulti ? undefined : field.value || ''}
                onValueChange={(val: string) => {
                  if (isMulti) {
                    const newValues = [...selectedValues];
                    const idx = newValues.indexOf(val);
                    if (idx > -1) newValues.splice(idx, 1);
                    else newValues.push(val);
                    field.onChange(newValues);
                  } else {
                    field.onChange(val);
                  }
                }}
                // isMulti={isMulti}
              >
                <SelectTrigger className="w-[100%]">
                  {selectedValues.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {selectedValues.map((val) => (
                        <div
                          key={val}
                          className="flex items-center rounded bg-gray-200 px-2 py-0.5 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {options.find((opt) => opt.value === val)?.label ||
                            val}
                          {isMulti && (
                            <button
                              type="button"
                              className="ml-1 text-gray-600 hover:text-gray-800"
                              onClick={() => handleDeselect(val)}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className={placeholderClassName}>{placeholder}</span>
                  )}
                </SelectTrigger>

                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span
                        className={cn(
                          colorMap?.[option.value],
                          'font-outfit rounded-md px-3 py-1 text-sm leading-[16px] font-medium',
                        )}
                      >
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {fieldState.error && (
                <span className="text-error text-sm">
                  {fieldState.error.message}
                </span>
              )}
            </>
          );
        }}
      />
    </div>
  );
}
