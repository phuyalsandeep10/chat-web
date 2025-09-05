import { cn } from '@/lib/utils';
import React from 'react';

const SubSidebarContentWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'border-r-gray-light box-border h-screen w-[234px] border-r-1 px-2.5 py-[30px]',
        className,
      )}
    >
      <div>{children}</div>
    </div>
  );
};

export default SubSidebarContentWrapper;
