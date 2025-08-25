'use client';

import { crmChannels } from '@/components/custom-components/Integration/data';
import FilteredIntegration from '@/components/custom-components/Integration/FilteredIntegration';
import React from 'react';

const CRM = () => {
  return <FilteredIntegration channels={crmChannels} heading="CRM" />;
};

export default CRM;
