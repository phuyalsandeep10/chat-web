import React from 'react';
import InformationsWrapper from './InformationsWrapper';
import { Icons } from '@/components/ui/Icons';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';

const DeviceInfo = () => {
  const { customer } = useAgentConversationStore();
  return (
    <InformationsWrapper>
      <div className="">
        <h5 className="text-theme-text-dark flex items-center gap-2 font-medium">
          <Icons.computer className="h-4 w-4" />
          Device Information
        </h5>
        <div className="mt-3 space-y-2 text-sm">
          <div>
            <span className="text-brand-dark leading-21 font-normal">
              Chrome 126.0 on Desktop (Windows 11)
            </span>
          </div>
          <div className="flex gap-1">
            <span className="text-brand-dark text-sm leading-21 font-semibold">
              IP Address:
            </span>
            <span className="text-brand-dark text-sm font-normal">
              {customer?.ip_address}
            </span>
          </div>
        </div>
      </div>
    </InformationsWrapper>
  );
};

export default DeviceInfo;
