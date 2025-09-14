'use client';

import SubSidebarContentWrapper from '../CustomSidebar/SubSidebarContentWrapper';
import SettingsHeader from './SettingHeader';
import SubSettingsSidebarMenus from './SubSettingsSidebarMenus';
import React from 'react';

const Settings = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full">
      <SubSidebarContentWrapper>
        <SubSettingsSidebarMenus />
      </SubSidebarContentWrapper>

      <div className="flex-1">
        <SettingsHeader />
        <div className="max-h-[90vh] overflow-y-auto px-20 pt-11">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Settings;
