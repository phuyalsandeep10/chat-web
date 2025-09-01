'use client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

interface DropdownItem {
  label: string;
  onClick?: () => void;
  className?: string;
}

interface DropdownProps {
  items: DropdownItem[];
  icon?: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ items, icon }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-theme-text-primary flex h-6 w-6 cursor-pointer items-center justify-center transition-colors">
        {icon || <MoreVertical size={16} />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            className={`hover:bg-secondary-disabled flex cursor-pointer items-center gap-2 ${item.className || ''}`}
            onClick={item.onClick}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
