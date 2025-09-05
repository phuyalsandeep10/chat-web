import { Button } from '@/components/ui/button';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';
import { RiAccountCircle2Fill } from '@remixicon/react';
import React from 'react';

const InboxChatInfoProfileInfo = () => {
  const { customer } = useAgentConversationStore();
  // console.log(customer);
  return (
    <div className="border-b text-center">
      <div className="bg-brand-primary border-light-blue mx-auto mb-3 flex h-[100px] w-[100px] items-center justify-center rounded-full border-2">
        <span className="text-xl font-medium text-white">
          {customer?.name?.slice(0, 2)?.toUpperCase()}
        </span>
      </div>
      <h4 className="text-theme-text-dark font-semibold md:text-2xl">
        {customer?.name}
      </h4>
      <p className="text-theme-text-primary mb-2 text-base leading-[26px] font-normal">
        {customer?.email}
      </p>
      <Button className="h-[36px] w-full cursor-pointer text-sm">
        <RiAccountCircle2Fill />
        <span>View Full Profile</span>
      </Button>
    </div>
  );
};

export default InboxChatInfoProfileInfo;
