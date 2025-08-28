import { Icons } from '@/components/ui/Icons';
import React from 'react';
import InformationsWrapper from './InformationsWrapper';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';

const ContactInfo = () => {
  const { customer } = useAgentConversationStore();
  return (
    <InformationsWrapper>
      <div>
        <h5 className="text-theme-text-dark flex items-center gap-2 font-medium">
          <Icons.contact_line className="h-4 w-4" />
          Contact Information
        </h5>
        <div className="space-y-2">
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-1">
              <Icons.mail className="h-4 w-4" />
              <span className="text-sm text-gray-600">{customer?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icons.copy className="h-4 w-4 text-gray-400" />
              <Icons.pencil className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <Icons.phone className="h-4 w-4" />
              <span className="text-sm text-gray-600">{customer?.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icons.copy className="h-4 w-4 text-gray-400" />
              <Icons.pencil className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </InformationsWrapper>
  );
};

export default ContactInfo;
