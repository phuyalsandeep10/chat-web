'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Flag from 'react-world-flags';
import { Icons } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';
import { Country, TimeZone } from '@/services/organizations/types';

type CountrySelectProps = {
  value: TimeZone | null;
  onChange: (timezone: TimeZone) => void;
  countries?: Country[];
  timezones?: TimeZone[];
  buttonClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  wrapperClassName?: string;
  placeholder?: string;
  disabled?: boolean;
};

const WorkspaceCountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  timezones,
  buttonClassName = 'w-60 justify-between',
  contentClassName = 'w-60',
  itemClassName = '',
  wrapperClassName = '',
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={wrapperClassName}>
      <DropdownMenu open={open} onOpenChange={(o) => setOpen(o)}>
        <DropdownMenuTrigger asChild>
          <Button
            className={`border-gray-light h-10 border-1 bg-white ${contentClassName} ${buttonClassName}`}
          >
            <div className="flex w-full items-center justify-between">
              {value ? (
                <div className="flex items-center gap-2">
                  <Flag
                    code={value.country_code}
                    style={{ width: 24, height: 16 }}
                  />
                  <span className="text-pure-black font-normal">
                    {value.display_name}
                  </span>
                </div>
              ) : (
                <span>Select TimeZone</span>
              )}
              <div className="text-gray-light ml-2">
                {open ? (
                  <Icons.chevron_up size={12} />
                ) : (
                  <Icons.chevron_down size={12} />
                )}
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={4}
          className="min-w-[var(--radix-dropdown-menu-trigger-width)]"
        >
          {timezones?.map((timezone: TimeZone) => (
            <DropdownMenuItem
              key={timezone.id}
              onClick={() => onChange(timezone)}
              className={cn(
                'flex cursor-pointer items-center gap-2',
                itemClassName,
              )}
            >
              <Flag
                code={timezone.country_code}
                style={{ width: 20, height: 13 }}
              />
              <span>{timezone.display_name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default WorkspaceCountrySelect;
