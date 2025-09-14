'use client';

import Label from '@/components/common/hook-form/Label';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Icons } from '@/components/ui/Icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface EmailSelectorFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  required?: boolean;
  options: { label: string; value: string }[];
  isAddingNew: boolean;
  setIsAddingNew: (val: boolean) => void;
  open: boolean;
  setOpen: (val: boolean) => void;
  error?: string;
}

export function EmailSelectorField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  options,
  isAddingNew,
  setIsAddingNew,
  open,
  setOpen,
  error,
}: EmailSelectorFieldProps<T>) {
  return (
    <div>
      <Label
        htmlFor={name}
        required={required}
        className="text-brand-dark font-outfit pb-1 text-sm font-semibold"
      >
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          isAddingNew ? (
            <input
              type="email"
              {...field}
              placeholder="Enter customer email"
              className={cn(
                'border-gray-light placeholder:text-gray-primary focus:ring-gray-primary h-9 w-full rounded-md border px-4 py-2 placeholder:text-sm focus:ring focus:outline-none',
              )}
            />
          ) : (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="border-gray-light font-outfit h-9 w-full justify-between text-sm font-normal text-black hover:bg-white"
                >
                  {field.value ? (
                    <span className="font-normal text-black">
                      {field.value}
                    </span>
                  ) : (
                    <span className="text-gray-primary font-outfit text-sm font-normal">
                      Select email
                    </span>
                  )}
                  <Icons.chevron_down className="text-gray-primary ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="text-gray-primary w-full min-w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput placeholder="Search email..." />
                  <CommandEmpty>No customer found.</CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-y-auto">
                    {options.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        onSelect={() => {
                          field.onChange(opt.value);
                          setOpen(false);
                        }}
                        className="font-outfit mb-2 border-b text-base font-normal text-black"
                      >
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <div className="border-t p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="bg-brand-primary hover:bg-brand-primary font-outfit flex w-full cursor-pointer items-center justify-center gap-1 text-center text-base font-medium text-white"
                      onClick={() => {
                        setOpen(false);
                        setIsAddingNew(true);
                      }}
                    >
                      <Icons.plus className="h-4 w-4" />
                      Add New Email
                    </Button>
                  </div>
                </Command>
              </PopoverContent>
            </Popover>
          )
        }
      />
      {error && <p className="text-alert-prominent mt-1 text-sm">{error}</p>}
    </div>
  );
}
