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
  value: Country | null;
  onChange: (country: Country) => void;
  countries?: Country[];
  buttonClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  wrapperClassName?: string;
  placeholder?: string;
  disabled?: boolean;
};

const defaultCountries: Country[] = [
  { id: 1, name: 'Nepal', code: 'NP', phone_code: '+977' },
  { id: 2, name: 'United States', code: 'US', phone_code: '+1' },
  { id: 3, name: 'France', code: 'FR', phone_code: '+33' },
  { id: 4, name: 'Japan', code: 'JP', phone_code: '+81' },
  { id: 5, name: 'India', code: 'IN', phone_code: '+91' },
  { id: 6, name: 'Germany', code: 'DE', phone_code: '+49' },
  { id: 7, name: 'Canada', code: 'CA', phone_code: '+1' },
  { id: 8, name: 'United Kingdom', code: 'GB', phone_code: '+44' },
  { id: 9, name: 'Australia', code: 'AU', phone_code: '+61' },
  { id: 10, name: 'China', code: 'CN', phone_code: '+86' },
  { id: 11, name: 'Brazil', code: 'BR', phone_code: '+55' },
  { id: 12, name: 'Russia', code: 'RU', phone_code: '+7' },
  { id: 13, name: 'South Korea', code: 'KR', phone_code: '+82' },
  { id: 14, name: 'Italy', code: 'IT', phone_code: '+39' },
  { id: 15, name: 'Spain', code: 'ES', phone_code: '+34' },
  { id: 16, name: 'Pakistan', code: 'PK', phone_code: '+92' },
  { id: 17, name: 'Bangladesh', code: 'BD', phone_code: '+880' },
  { id: 18, name: 'United Arab Emirates', code: 'AE', phone_code: '+971' },
  { id: 19, name: 'Singapore', code: 'SG', phone_code: '+65' },
  { id: 20, name: 'Thailand', code: 'TH', phone_code: '+66' },
  { id: 21, name: 'Indonesia', code: 'ID', phone_code: '+62' },
  { id: 22, name: 'Philippines', code: 'PH', phone_code: '+63' },
  { id: 23, name: 'Vietnam', code: 'VN', phone_code: '+84' },
  { id: 24, name: 'Egypt', code: 'EG', phone_code: '+20' },
  { id: 25, name: 'Mexico', code: 'MX', phone_code: '+52' },
  { id: 26, name: 'South Africa', code: 'ZA', phone_code: '+27' },
];

const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  countries = defaultCountries,
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
                  <Flag code={value.code} style={{ width: 24, height: 16 }} />
                  <span className="text-pure-black font-normal">
                    {value.name}
                  </span>
                </div>
              ) : (
                <span>Select Country</span>
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
          {countries.map((country) => (
            <DropdownMenuItem
              key={country.code}
              onClick={() => onChange(country)}
              className={cn(
                'flex cursor-pointer items-center gap-2',
                itemClassName,
              )}
            >
              <Flag code={country.code} style={{ width: 20, height: 13 }} />
              <span>{country.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CountrySelect;
