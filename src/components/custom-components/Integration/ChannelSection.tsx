'use client';

import React from 'react';
import CardComponent from '@/components/custom-components/Integration/CardComponent';
import HeadingTypography from './HeadingTypography';
import ViewDetails from './ViewDetails';
import { ChannelProps } from './types';

const ChannelSection: React.FC<ChannelProps> = ({
  channels,
  heading,
  selectedTab,
  connectionStatus,
  onConnectionChange,
  showViewDetails = true,
  viewMoreLink,
}) => {
  const filteredChannels = channels.filter((channel) => {
    if (selectedTab === 'view-all') return true;
    if (selectedTab === 'active') return connectionStatus[channel.name];
    if (selectedTab === 'inactive') return !connectionStatus[channel.name];
    return true;
  });

  if (filteredChannels.length === 0) return null;

  return (
    <div className="w-full">
      {heading && <HeadingTypography heading={heading} />}
      <div className="grid gap-[29px] sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredChannels.map((channel, index) => (
          <CardComponent
            key={index}
            image={channel.image}
            name={channel.name}
            price={channel.price}
            description={channel.description}
            websiteUrl={channel.websiteUrl}
            isConnected={connectionStatus[channel.name]}
            route={channel.route}
            onConnectionChange={(isConnected) =>
              onConnectionChange(channel.name, isConnected)
            }
          />
        ))}
      </div>
      {showViewDetails && viewMoreLink && <ViewDetails href={viewMoreLink} />}
    </div>
  );
};

export default ChannelSection;
