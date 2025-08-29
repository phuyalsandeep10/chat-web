'use client';
import React from 'react';
import { Icons } from '@/components/ui/Icons';
import { HeaderComponentProps } from './types';
import { cn } from '@/lib/utils';

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  heading,
  className = '',
}) => {
  return (
    <div className="flex items-center gap-2">
      <h1
        className={cn(
          'text-brand-dark text-[32px] leading-10 font-semibold',
          className,
        )}
      >
        {heading}
      </h1>
      <span className="flex items-center">
        <Icons.help className="text-theme-text-primary h-6 w-6" />
      </span>
    </div>
  );
};

export default HeaderComponent;
