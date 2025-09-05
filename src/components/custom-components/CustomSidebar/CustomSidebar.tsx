'use client';
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import UserSidebarFooterMenu from './SidebarFooterMenu';
import UserSidebarHeader from './SidebarHeader';

import MainSidebar from '@/components/custom-components/MainSidebar/MainSideBar';
import { cn } from '@/lib/utils';
const CustomSidebar = () => {
  return (
    <div>
      <Sidebar>
        <SidebarHeader className={cn('px-3.5 py-[30px]')}>
          <UserSidebarHeader />
        </SidebarHeader>
        <SidebarContent className={cn('px-3.5')}>
          <MainSidebar />
        </SidebarContent>
        <SidebarFooter className={cn('px-3.5')}>
          <SidebarMenu>
            <SidebarMenuItem>
              <UserSidebarFooterMenu />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
};

export default CustomSidebar;
