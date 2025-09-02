'use client';

import React from 'react';
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import Label from './Label';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Select } from '@radix-ui/react-select';

type SelectFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  options: {
    value: string;
    label: React.ReactNode;
  }[];
  placeholder?: string;
  className?: string;
  colorMap?: Record<string, string>; // Add this prop for color mapping
  LabelClassName?: string;
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
}: SelectFieldProps<T>) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <Label
          htmlFor={name}
          required={required}
          className={cn(`text-sm font-medium ${LabelClassName}`)}
        >
          {label}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          // Get the background class for selected value
          const selectedBg =
            colorMap && field.value ? colorMap[field.value] : '';

          return (
            <>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id={name}
                  className="border-gray-light w-full rounded-md border"
                >
                  {field.value ? (
                    <span
                      className={cn(
                        colorMap?.[field.value],
                        'rounded-md px-3 py-1 text-sm capitalize',
                      )}
                    >
                      {options.find((opt) => opt.value === field.value)
                        ?.label ?? field.value}
                    </span>
                  ) : (
                    <SelectValue placeholder={placeholder} />
                  )}
                </SelectTrigger>

                <SelectContent>
                  {options.length > 0 ? (
                    options.map((option) => (
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
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Data Not Available
                    </div>
                  )}
                </SelectContent>
              </Select>

              {fieldState.error && (
                <span className="text-error text-xs">
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
