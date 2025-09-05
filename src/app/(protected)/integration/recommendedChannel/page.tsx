'use client';

import { recommendedChannels } from '@/components/custom-components/Integration/data';
import FilteredIntegration from '@/components/custom-components/Integration/FilteredIntegration';
import React from 'react';

const recommendedChannel = () => {
  return (
    <FilteredIntegration
      channels={recommendedChannels}
      heading="Recommended Channel"
    />
  );
};

export default recommendedChannel;
