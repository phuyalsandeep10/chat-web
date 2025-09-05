'use client';

import Settings from '@/components/custom-components/Settings/Settings';
import React, { useState } from 'react';
import TabsFilter from './TabsFilter';
import SectionWrapper from './SectionWrapper';
import ChannelSection from './ChannelSection';
import {
  activeChannels,
  recommendedChannels,
  crmChannels,
  marketingChannels,
  messagingChannels,
} from './data';
import { Channel } from './types';

const hasVisibleChannels = (
  channels: Channel[],
  selectedTab: 'view-all' | 'active' | 'inactive',
  connectionStatus: Record<string, boolean>,
) =>
  channels.some(
    (channel) =>
      selectedTab === 'view-all' ||
      (selectedTab === 'active' && connectionStatus[channel.name]) ||
      (selectedTab === 'inactive' && !connectionStatus[channel.name]),
  );

const Integration: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<
    'view-all' | 'active' | 'inactive'
  >('view-all');
  const [connectionStatus, setConnectionStatus] = useState<
    Record<string, boolean>
  >(() => {
    const initialStatus: Record<string, boolean> = {};
    const allChannels: Channel[] = [
      ...activeChannels,
      ...recommendedChannels,
      ...crmChannels,
      ...marketingChannels,
      ...messagingChannels,
    ];
    allChannels.forEach((channel) => {
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
      <div className="mb-5">
        <h1 className="mb-1 text-[32px] leading-10 font-semibold">
          All Integration
        </h1>
      </div>

      <TabsFilter selectedTab={selectedTab} onTabChange={setSelectedTab} />

      {/* Active Channels */}
      <SectionWrapper
        isVisible={hasVisibleChannels(
          activeChannels,
          selectedTab,
          connectionStatus,
        )}
      >
        <ChannelSection
          channels={activeChannels}
          heading="Active Channels"
          selectedTab={selectedTab}
          connectionStatus={connectionStatus}
          onConnectionChange={handleConnectionChange}
          showViewDetails={false}
        />
      </SectionWrapper>

      {/* Recommended Channels */}
      <SectionWrapper
        isVisible={hasVisibleChannels(
          recommendedChannels,
          selectedTab,
          connectionStatus,
        )}
      >
        <ChannelSection
          channels={recommendedChannels.slice(0, 3)}
          heading="Recommended Channel"
          selectedTab={selectedTab}
          connectionStatus={connectionStatus}
          onConnectionChange={handleConnectionChange}
          viewMoreLink="/integration/recommendedChannel"
        />
      </SectionWrapper>

      {/* CRM Channels */}
      <SectionWrapper
        isVisible={hasVisibleChannels(
          crmChannels,
          selectedTab,
          connectionStatus,
        )}
      >
        <ChannelSection
          channels={crmChannels.slice(0, 3)}
          heading="CRM"
          selectedTab={selectedTab}
          connectionStatus={connectionStatus}
          onConnectionChange={handleConnectionChange}
          viewMoreLink="/integration/crm"
        />
      </SectionWrapper>

      {/* Marketing Channels */}
      <SectionWrapper
        isVisible={hasVisibleChannels(
          marketingChannels,
          selectedTab,
          connectionStatus,
        )}
      >
        <ChannelSection
          channels={marketingChannels.slice(0, 3)}
          heading="Marketing"
          selectedTab={selectedTab}
          connectionStatus={connectionStatus}
          onConnectionChange={handleConnectionChange}
          viewMoreLink="/integration/marketing"
        />
      </SectionWrapper>

      {/* Messaging Channels */}
      <SectionWrapper
        isVisible={hasVisibleChannels(
          messagingChannels,
          selectedTab,
          connectionStatus,
        )}
      >
        <ChannelSection
          channels={messagingChannels.slice(0, 3)}
          heading="Messaging"
          selectedTab={selectedTab}
          connectionStatus={connectionStatus}
          onConnectionChange={handleConnectionChange}
          viewMoreLink="/integration/messaging"
        />
      </SectionWrapper>
    </Settings>
  );
};

export default Integration;
