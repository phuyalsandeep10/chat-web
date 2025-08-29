'use client';

import React from 'react';
import FilteredIntegration from '@/components/custom-components/Integration/FilteredIntegration';
import { marketingChannels } from '@/components/custom-components/Integration/data';

const Marketing = () => {
  return (
    <FilteredIntegration channels={marketingChannels} heading="Marketing" />
  );
};

export default Marketing;
