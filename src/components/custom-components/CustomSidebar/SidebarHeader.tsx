import React from 'react';
import Logo from '@/assets/svg/Logo';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ROUTES } from '@/routes/routes';
import { useWorkspaceInformationStore } from '@/store/WorkspaceInformation/useWorkspaceInformation';
import Image from 'next/image';
// import { useSidebar } from '@/components/ui/sidebar';
const SidebarHeader: React.FC = () => {
  // const { toggleSidebar } = useSidebar();
  const { workspace } = useWorkspaceInformationStore();
  console.log('From Sidebar: ', workspace);
  const logoSrc = workspace?.owner_image?.startsWith('https')
    ? workspace.owner_image
    : '';
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
          {logoSrc ? (
            <Image src={logoSrc} alt={workspace?.owner_name || 'logo'} />
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
          <h1 className="from-theme-text-dark via-brand-text to-brand-primary font-outfit w-40 truncate bg-gradient-to-r bg-clip-text text-lg leading-[29px] font-medium text-transparent">
            {workspace?.owner_name || 'Org Name'}
          </h1>
          <p className="text-theme-text-primary font-outfit w-40 truncate text-xs leading-[17px] font-normal">
            {workspace?.domain || 'example.com'}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default SidebarHeader;
