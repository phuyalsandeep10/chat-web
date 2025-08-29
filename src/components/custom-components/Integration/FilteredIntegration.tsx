'use client';

import React, { useState } from 'react';
import Settings from '@/components/custom-components/Settings/Settings';
import TabsFilter from '@/components/custom-components/Integration/TabsFilter';
import ChannelSection from '@/components/custom-components/Integration/ChannelSection';
import { FilteredIntegrationProps } from '@/components/custom-components/Integration/types';

const FilteredIntegration: React.FC<FilteredIntegrationProps> = ({
  channels,
  heading,
}) => {
  const [selectedTab, setSelectedTab] = useState<
    'view-all' | 'active' | 'inactive'
  >('view-all');
  const [connectionStatus, setConnectionStatus] = useState<
    Record<string, boolean>
  >(() => {
    const initialStatus: Record<string, boolean> = {};
    channels.forEach((channel) => {
      initialStatus[channel.name] = false;
    });
    return initialStatus;
  });

  const handleConnectionChange = (
    channelName: string,
    isConnected: boolean,
  ) => {
    setConnectionStatus((prev) => ({ ...prev, [channelName]: isConnected }));
  };

  return (
    <Settings>
      <div className="mb-10">
        <h1 className="text-[32px] leading-10 font-semibold">{heading}</h1>
      </div>

      <div className="mb-10">
        <TabsFilter selectedTab={selectedTab} onTabChange={setSelectedTab} />
      </div>

      <ChannelSection
        channels={channels}
        selectedTab={selectedTab}
        connectionStatus={connectionStatus}
        onConnectionChange={handleConnectionChange}
        showViewDetails={false}
      />
    </Settings>
  );
};

export default FilteredIntegration;
