'use client';

import React, { useState, useRef, ReactNode, useEffect } from 'react';
import Settings from '@/components/custom-components/Settings/Settings';
import InviteAgents from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/InviteAgents';
import InviteAgentsTabsHeader from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/InviteAgentsTabsHeader';

const InviteAgentsPage = () => {
  return (
    <Settings>
      <InviteAgents />
      <InviteAgentsTabsHeader />
    </Settings>
  );
};

export default InviteAgentsPage;
