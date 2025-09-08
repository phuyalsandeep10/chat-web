'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ElementType } from 'react';

interface CustomTooltipProps {
  data?: string;
  className?: string;
  as?: ElementType; // allows "p", "h1", "span" or even a React component
}

export function CustomTooltip({
  data = '',
  className,
  as: Component = 'p',
}: CustomTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Component className={cn('cursor-pointer truncate', className)}>
            {data}
          </Component>
        </TooltipTrigger>
        <TooltipContent>
          <p>{data}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
