'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';
import { ROUTES } from '@/routes/routes';

interface SidebarProps {
  label: string;
  icon: React.ComponentType<any>;
  route: string; // e.g., "/settings"
}

interface SidebarListProps {
  title: string;
  sidebar: SidebarProps[];
  collapsed?: boolean;
  className?: string;
}

const SidebarList: React.FC<SidebarListProps> = ({
  title,
  sidebar,
  className = '',
  collapsed = false,
}) => {
  const router = useRouter();
  const pathname = usePathname() ?? '';

  const {
    visitorCount,
    messageNotificationCount,
    resetVisitorCount,
    resetMessageNotificationCount,
  } = useAgentConversationStore();

  // Get first segment from path (e.g., 'settings' from '/settings/workspace-settings')
  const firstSegment = pathname.split('/')[1];

  useEffect(() => {
    if (firstSegment === 'visitors') {
      resetVisitorCount();
    } else if (firstSegment === 'inbox') {
      resetMessageNotificationCount();
    }
  }, [firstSegment, resetVisitorCount, resetMessageNotificationCount]);

  const handleNavigate = (route: string) => {
    router.push(route);
  };

  return (
    <div className={cn('w-full pt-10')}>
      {!collapsed && (
        <h2 className="text-brand-primary font-outfit pb-3 text-sm font-semibold">
          {title}
        </h2>
      )}

      <div className={`space-y-6 ${className}`}>
        {sidebar.map(({ label, icon: Icon, route }) => {
          const routeSegment = route.split('/')[1]; // e.g., 'settings'
          const isActive = firstSegment === routeSegment;

          // console.log(pathname);

          const buttonContent = (
            <button
              key={label}
              onClick={() => handleNavigate(route)}
              className={cn(
                'font-outfit flex cursor-pointer items-center gap-2 text-sm font-normal transition-colors',
                collapsed && 'justify-center',
                isActive
                  ? 'text-brand-primary font-semibold'
                  : 'text-theme-text-dark hover:text-brand-primary',
              )}
            >
              <Icon className="h-5 w-5" />
              {!collapsed && <span>{label}</span>}
              {route === ROUTES.TOOLS_FEATURES.VISITORS && (
                <span className="bg-brand-primary flex h-4 w-4 items-center justify-center rounded-full text-xs text-white">
                  {visitorCount}
                </span>
              )}
              {route === ROUTES.YOUR_INBOXES.MAIN_INBOX && (
                <span className="bg-brand-primary flex h-4 w-4 items-center justify-center rounded-full text-xs text-white">
                  {messageNotificationCount}
                </span>
              )}
            </button>
          );

          return collapsed ? (
            <Tooltip key={label}>
              <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {label}
              </TooltipContent>
            </Tooltip>
          ) : (
            <div key={label}>{buttonContent}</div>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarList;
