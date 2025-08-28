import { Button } from '@/components/ui/button';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';
import React from 'react';

const InboxChatInfoProfileInfo = () => {
  const { customer } = useAgentConversationStore();
  // console.log(customer);
  return (
    <div className="border-b p-4 text-center">
      <div className="bg-brand-primary border-light-blue mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2">
        <span className="text-xl font-medium text-white">
          {customer?.name?.slice(0, 2)?.toUpperCase()}
        </span>
      </div>
      <h4 className="text-theme-text-dark font-semibold">{customer?.name}</h4>
      <p className="text-theme-text-primary mb-2 text-base leading-[26px] font-normal">
        {customer?.email}
      </p>
      <Button className="w-full cursor-pointer text-sm">
        <div>{/* Icon is remaining  */}</div>
        <span>View Full Profile</span>
      </Button>
    </div>
  );
};

export default InboxChatInfoProfileInfo;
