'use client';

import { messagingChannels } from '@/components/custom-components/Integration/data';
import FilteredIntegration from '@/components/custom-components/Integration/FilteredIntegration';
import React from 'react';

const Messaging = () => {
  return (
    <FilteredIntegration channels={messagingChannels} heading="Messaging" />
  );
};

export default Messaging;
