import React, { useEffect, useState } from 'react';
import Logo from '@/assets/svg/Logo';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ROUTES } from '@/routes/routes';
import { useWorkspaceInformationStore } from '@/store/WorkspaceInformation/useWorkspaceInformation';
import Image from 'next/image';
import { useGetOrganizationById } from '@/hooks/organizations/useGetorganizations';
import { useSidebar } from '@/components/ui/sidebar';
import { RiMenu2Fill } from '@remixicon/react';
const SidebarHeader: React.FC = () => {
  const { toggleSidebar } = useSidebar();

  useGetOrganizationById();

  const workspace = useWorkspaceInformationStore((state) => state.workspace);

  const TABLET_WIDTH = 1000;

  const [collapsed, setCollapsed] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const toggleSidebarButton = () => {
    setCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const knowTablet = () => {
      setIsTablet(() => window.innerWidth < TABLET_WIDTH);
    };
    knowTablet();

    window.addEventListener('resize', knowTablet);
    return () => window.removeEventListener('resize', knowTablet);
  }, []);

  useEffect(() => {
    if (isTablet && !collapsed) {
      toggleSidebar();
      setCollapsed(true);
    } else if (!isTablet && collapsed) {
      toggleSidebar();
      setCollapsed(false);
    }
  }, [isTablet]);

  const logoSrc = workspace?.logo?.startsWith('https') ? workspace.logo : '';
  // console.log(logoSrc);

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between transition-all duration-300',
      )}
    >
      <button
        className={`top-2 transform cursor-pointer ${isTablet ? 'fixed' : 'fixed'} ${collapsed ? 'left-2 transition-all' : 'left-50 transition-all'}`}
        onClick={() => {
          toggleSidebar();
          toggleSidebarButton();
        }}
      >
        <RiMenu2Fill />
      </button>

      <Link href={ROUTES.DASHBOARD} className="flex items-center">
        {/* Fix logo container width to avoid shifting */}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center">
          {logoSrc ? (
            <Image
              width={32}
              height={32}
              src={logoSrc}
              alt={workspace?.owner_name || 'logo'}
              className={cn('h-10 w-10 rounded-full object-cover')}
              priority
            />
          ) : (
            <Logo />
          )}
        </div>

        {/* Animate the text container's width and opacity */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
          )}
        >
          <h1 className="from-theme-text-dark via-brand-text to-brand-primary font-outfit truncate bg-gradient-to-r bg-clip-text text-lg leading-[29px] font-medium text-transparent">
            {workspace?.name || 'Org Name'}
          </h1>
          <p className="text-theme-text-primary font-outfit truncate text-xs leading-[17px] font-normal">
            {workspace?.domain || 'example.com'}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default SidebarHeader;
