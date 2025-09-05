'use client';
import { Icons } from '@/components/ui/Icons';
import { Input } from '@/components/ui/input';

import React from 'react';
import ConversationsList from './ConversationsList';
import SearchBox from './SearchBox';

const InboxSubSidebar = () => {
  return (
    <div className="font-outfit w-full">
      <div className="flex items-center justify-between">
        <p className="text-theme-text-primary text-xl leading-[30px] font-semibold">
          Conversation
        </p>
        {/* <span>
          <Icons.filter className="h-4 w-4" />
        </span> */}
      </div>

      {/* <SearchBox /> */}
      <ConversationsList />
    </div>
  );
};

export default InboxSubSidebar;
