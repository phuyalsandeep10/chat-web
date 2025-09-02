import React from 'react';
import Logo from '@/assets/svg/Logo';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ROUTES } from '@/routes/routes';
// import { useSidebar } from '@/components/ui/sidebar';
const SidebarHeader: React.FC = () => {
  // const { toggleSidebar } = useSidebar();
  return (
    <div
      className={cn(
        'flex w-full items-center justify-between transition-all duration-300',
      )}
    >
      <Link href={ROUTES.DASHBOARD} className="flex items-center">
        {/* Fix logo container width to avoid shifting */}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center">
          {/* <button onClick={toggleSidebar}>hello</button> */}
          <Logo />
        </div>

        {/* Animate the text container's width and opacity */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
          )}
        >
          <h1 className="from-theme-text-dark via-brand-text to-brand-primary font-outfit bg-gradient-to-r bg-clip-text text-lg leading-[29px] font-medium text-transparent">
            Brahmabyte Lab
          </h1>
          <p className="text-theme-text-primary font-outfit text-xs leading-[17px] font-normal">
            brahmabytelab.com
          </p>
        </div>
      </Link>
    </div>
  );
};

export default SidebarHeader;
