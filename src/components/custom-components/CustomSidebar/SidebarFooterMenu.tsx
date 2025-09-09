'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import React from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';
import { useLogout } from '@/hooks/auth/useLogout';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import { ROUTES } from '@/routes/routes';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth/auth';
import { CustomTooltip } from '@/shared/CustomTooltip';

const SidebarFooterMenu = () => {
  const router = useRouter();
  const { mutate: logout, isPending } = useLogout();
  const { authData } = useAuthStore((state) => state);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-full">
        <div
          className={cn(
            'corsor transition-colors-pointer flex w-full cursor-pointer items-center gap-3 rounded-md',
          )}
        >
          {/* Avatar with gradient ring */}
          <div
            className={cn(
              'from-theme-text-dark via-brand-text to-brand-primary font-outfit rounded-full bg-gradient-to-r p-[2px]',
            )}
          >
            <div className={cn('min-h-8 min-w-8 rounded-full bg-white')}>
              <img
                src={
                  authData?.data?.user?.image
                    ? authData?.data?.user?.image
                    : '/profile-placeholder.jpeg'
                }
                alt="User"
                width={32}
                height={32}
                className={cn('h-8 w-8 rounded-full object-cover')}
              />
            </div>
          </div>

          {/* Name & Email */}
          <div className={cn('flex w-full flex-col')}>
            <CustomTooltip
              data={authData?.data?.user?.name || ''}
              as="span"
              className="text-theme-text-dark font-outfit w-40 text-lg font-medium"
            />

            <CustomTooltip
              data={authData?.data?.user?.email || ''}
              as="span"
              className="text-theme-text-primary font-outfit w-40 text-xs font-normal"
            />
          </div>

          {/* Right arrow */}
          <Icons.chevron_right className="h-6 w-6" />
        </div>
      </DropdownMenuTrigger>

      {/* Optional Dropdown Content */}

      <DropdownMenuContent side="top" className={cn('w-full')}>
        <DropdownMenuItem
          onSelect={(e) => {
            // e.preventDefault();
            router.push(ROUTES.SETTINGS.ACCOUNT_INFORMATION);
          }}
          className={cn('hover:bg-muted w-full cursor-pointer text-sm')}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            AuthService.clearAuthTokens();
            router.replace(ROUTES.LOGIN);
            logout();
          }}
          className={cn('hover:bg-muted w-full cursor-pointer text-sm')}
        >
          {isPending ? 'Logging out' : 'Logout'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SidebarFooterMenu;
