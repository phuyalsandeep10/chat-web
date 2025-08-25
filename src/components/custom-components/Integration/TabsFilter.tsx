'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/Icons';
import { TabsFilterProps } from './types';

const TabsFilter: React.FC<TabsFilterProps> = ({
  selectedTab,
  onTabChange,
}) => {
  return (
    <div className="mb-9 flex justify-between">
      <Tabs
        value={selectedTab}
        onValueChange={(value) =>
          onTabChange(value as 'view-all' | 'active' | 'inactive')
        }
      >
        <TabsList className="border-gray-light overflow-hidden rounded-sm border-1 p-0 text-xs">
          <TabsTrigger
            value="view-all"
            className="data-[state=active]:bg-brand-primary h-full rounded-none bg-white px-6 font-semibold text-black data-[state=active]:text-white"
          >
            View all
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-brand-primary flex h-full items-center gap-1 rounded-none bg-white px-6 font-semibold text-black data-[state=active]:text-white"
          >
            <span className="text-success">●</span>
            Active
          </TabsTrigger>
          <TabsTrigger
            value="inactive"
            className="data-[state=active]:bg-brand-primary h-full rounded-none bg-white px-6 font-semibold text-black data-[state=active]:text-white"
          >
            Inactive
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="relative w-full max-w-64">
        <Icons.search
          className="text-theme-text-primary absolute top-1/2 left-3 -translate-y-1/2"
          size={18}
        />
        <Input
          placeholder="Search"
          className="border-theme-text-light text-theme-text-primary focus-visible:border-theme-text-light rounded-lg border py-2 pr-4 pl-10 focus-visible:ring-0"
        />
      </div>
    </div>
  );
};

export default TabsFilter;
