'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';
import { Langauge } from '@/services/organizations/types';
import { Control, Controller } from 'react-hook-form';

type LanguageSelectProps = {
  name: string;
  control: Control<any>;
  languages?: Langauge[];
  buttonClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  wrapperClassName?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (language: Langauge) => void;
};

const defaultLanguages: Langauge[] = [
  { id: 1, name: 'Nepalese' },
  { id: 2, name: 'English' },
  { id: 3, name: 'French' },
  { id: 4, name: 'Japanese' },
  { id: 5, name: 'Hindi' },
  { id: 6, name: 'German' },
  { id: 7, name: 'Canadian French' },
  { id: 8, name: 'British English' },
  { id: 9, name: 'Australian English' },
  { id: 10, name: 'Chinese' },
  { id: 11, name: 'Portuguese (Brazil)' },
  { id: 12, name: 'Russian' },
  { id: 13, name: 'Korean' },
  { id: 14, name: 'Italian' },
  { id: 15, name: 'Spanish' },
  { id: 16, name: 'Urdu' },
  { id: 17, name: 'Bengali' },
  { id: 18, name: 'Arabic' },
  { id: 19, name: 'Malay' },
  { id: 20, name: 'Thai' },
  { id: 21, name: 'Indonesian' },
  { id: 22, name: 'Filipino' },
  { id: 23, name: 'Vietnamese' },
  { id: 24, name: 'Egyptian Arabic' },
  { id: 25, name: 'Mexican Spanish' },
  { id: 26, name: 'Afrikaans' },
];

const LanguageSelect: React.FC<LanguageSelectProps> = ({
  name,
  control,
  languages = defaultLanguages,
  buttonClassName = 'w-60 justify-between',
  contentClassName = 'w-60',
  itemClassName = '',
  wrapperClassName = '',
  placeholder = 'Select Language',
  disabled = false,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={wrapperClassName}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedLanguage = languages.find(
            (l) => l.name === field.value,
          );

          const handleSelect = (language: Langauge) => {
            field.onChange(language.name);
            onChange?.(language);
            setOpen(false);
          };

          return (
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={disabled}
                  className={cn(
                    'border-gray-light h-10 border-1 bg-white focus:ring-0 focus-visible:ring-0',
                    contentClassName,
                    buttonClassName,
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    {selectedLanguage ? (
                      <div className="flex items-center gap-2">
                        <span className="text-pure-black font-normal">
                          {selectedLanguage.name}
                        </span>
                      </div>
                    ) : (
                      <span>{placeholder}</span>
                    )}
                    <div className="text-gray-light ml-2">
                      <Icons.chevron_down
                        size={12}
                        className={`transform transition-all duration-300 ease-in-out ${open ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                sideOffset={4}
                className="min-w-[var(--radix-dropdown-menu-trigger-width)]"
              >
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.id}
                    onClick={() => handleSelect(language)}
                    className={cn(
                      'flex cursor-pointer items-center gap-2',
                      itemClassName,
                    )}
                  >
                    <span>{language.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }}
      />
    </div>
  );
};

export default LanguageSelect;
