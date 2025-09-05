'use client';

import { Icons } from '@/components/ui/Icons';
import React from 'react';
import InformationsWrapper from './InformationsWrapper';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';
import { useCopyToClipboard } from '@/hooks/utils/useCopyToClipboard';

const ContactInfo = () => {
  const { customer } = useAgentConversationStore();
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <InformationsWrapper>
      <div>
        <h5 className="text-theme-text-dark flex items-center gap-2 font-medium">
          <Icons.contact_line className="h-4 w-4" />
          Contact Information
        </h5>

        <div className="space-y-2">
          {/* Email Section */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-1">
              <Icons.mail className="h-4 w-4" />
              <span className="text-sm text-gray-600">{customer?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(customer?.email ?? '')}
                className="cursor-pointer"
              >
                {isCopied(customer?.email ?? '') ? (
                  <Icons.check className="h-4 w-4 text-gray-400" />
                ) : (
                  <Icons.copy className="h-4 w-4 text-gray-400" />
                )}
              </button>
              <Icons.pencil className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Phone Section */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <Icons.phone className="h-4 w-4" />
              <span className="text-sm text-gray-600">{customer?.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(customer?.phone ?? '')}
                className="cursor-pointer"
              >
                {isCopied(customer?.phone ?? '') ? (
                  <Icons.check className="h-4 w-4 text-gray-400" />
                ) : (
                  <Icons.copy className="h-4 w-4 text-gray-400" />
                )}
              </button>
              <Icons.pencil className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </InformationsWrapper>
  );
};

export default ContactInfo;
