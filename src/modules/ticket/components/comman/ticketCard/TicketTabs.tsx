'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { TicketCardProps } from '@/modules/ticket/types/type';

type TabOption = {
  label: string;
  status: TicketCardProps['status'] | 'ALL';
};

type TicketTabsProps = {
  tabs: TabOption[];
  selected: TicketCardProps['status'] | 'ALL';
  onSelect: (status: TicketCardProps['status'] | 'ALL') => void;
};

export default function TicketTabs({
  tabs,
  selected,
  onSelect,
}: TicketTabsProps) {
  return (
    <div className="mt-2 flex cursor-pointer gap-20 border-b sm:gap-28">
      {tabs.map(({ label, status }) => (
        <button
          key={label}
          onClick={() => onSelect(status)}
          className={cn(
            'cursor-pointer pb-2 text-sm font-semibold transition-colors',
            selected === status
              ? 'text-brand-primary border-brand-primary border-b-2'
              : 'text-muted-foreground hover:text-brand-primary',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
