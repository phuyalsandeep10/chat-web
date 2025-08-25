'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type Option = {
  label: string;
  value: string;
};

interface MultiSelectFieldProps {
  name: string;
  control: any;
  label?: string;
  options: Option[];
  placeholder?: string;
  LabelClassName?: string;
}

export const MultiSelectField = ({
  name,
  control,
  label,
  options,
  LabelClassName,
  placeholder = 'Select options',
}: MultiSelectFieldProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      <div className="pb-1">
        {label && <label className={cn(` ${LabelClassName} `)}>{label}</label>}
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedValues: string[] = field.value || [];

          const toggleValue = (value: string) => {
            if (selectedValues.includes(value)) {
              field.onChange(selectedValues.filter((v) => v !== value));
            } else {
              field.onChange([...selectedValues, value]);
            }
          };

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="border-gray-light font-outfit h-9 w-full justify-between font-normal text-black"
                >
                  <span
                    className={cn(
                      selectedValues.length === 0 &&
                        'font-outfit text-gray-primary text-sm',
                    )}
                  >
                    {selectedValues.length > 0
                      ? options
                          .filter((option) =>
                            selectedValues.includes(option.value),
                          )
                          .map((option) => option.label)
                          .join(', ')
                      : placeholder}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-full min-w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
                sideOffset={4}
              >
                <Command className="w-full">
                  <CommandGroup className="w-full">
                    {options.length > 0 ? (
                      options.map((option) => (
                        <CommandItem
                          key={option.value}
                          onSelect={() => toggleValue(option.value)}
                          className="w-full"
                        >
                          <div
                            className={cn(
                              'mr-2 flex w-4 items-center justify-center rounded-sm',
                              selectedValues.includes(option.value)
                                ? 'bg-primary'
                                : 'opacity-50',
                            )}
                          >
                            {selectedValues.includes(option.value) && (
                              <Check className="h-4 w-4" />
                            )}
                          </div>
                          <span className="">{option.label}</span>
                        </CommandItem>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        Data No Available
                      </div>
                    )}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          );
        }}
      />
    </div>
  );
};
