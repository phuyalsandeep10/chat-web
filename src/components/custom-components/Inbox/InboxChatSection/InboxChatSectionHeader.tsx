'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/ui/Icons';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';
import { useUiStore } from '@/store/UiStore/useUiStore';
import { ChevronDown, Languages, Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const InboxChatSectionHeader = () => {
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const { openChatInfo } = useUiStore();
  const { customer, conversation, resolveConversation, req_loading } =
    useAgentConversationStore();
  const router = useRouter();
  // console.log(customer, conversation);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-white p-4 pt-0">
      <div className="flex items-center space-x-3">
        <div className="bg-gray-light flex h-10 w-10 items-center justify-center rounded-full">
          <span className="text-theme-text-dark text-sm font-medium">
            {customer?.name?.substring(0, 2)?.toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-theme-text-dark font-medium">{customer?.name}</h2>
          <p className="text-theme-text-dark text-xs">{customer?.email}</p>
        </div>
      </div>
      {/* <div className="flex items-center space-x-2">
        {conversation?.is_resolved ? (
          <p>Conversation resolved</p>
        ) : (
          <button
            onClick={() => {
              resolveConversation(Number(conversation?.id));
              router.push('/inbox');
            }}
            disabled={req_loading.resolve_conversation}
            className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            {req_loading.resolve_conversation
              ? 'Resolving...'
              : 'Resolve the conversation'}
          </button>
        )}
        <button className="text-gray-light" onClick={openChatInfo}>
          <Icons.chevron_left className="h-5 w-5" />
        </button>
      </div> */}

      <div className="flex flex-wrap items-center gap-4">
        {/* Create a ticket button */}
        <Button className="bg-brand-primary flex items-center gap-2 rounded-lg !px-4 !py-2 text-xs text-white">
          <Ticket className="h-4 w-4" />
          Create a ticket
        </Button>

        {/* Profile image */}
        {/* <div className="h-10 w-10 overflow-hidden rounded-full">
          <Image
            height={40}
            width={40}
            src={'/profile-placeholder.jpeg'}
            className="h-10 w-10"
            alt=""
          />
        </div> */}

        {/* Quick action dropdown */}
        <div className="relative">
          <DropdownMenu
            open={isQuickActionOpen}
            onOpenChange={setIsQuickActionOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-gray-light hover:text-brand-primary flex items-center gap-2 rounded-lg bg-transparent px-4 py-2 text-xs hover:bg-transparent"
              >
                Quick action
                <ChevronDown className="text-gray-primary h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-32">
              {conversation?.is_resolved ? null : (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      resolveConversation(Number(conversation?.id));
                      // router.push('/inbox');
                    }}
                    className="text-brand-dark hover:bg-gray-50"
                  >
                    Resolve
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuItem className="text-red-600 hover:bg-red-50">
                Block
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <button className="text-gray-light" onClick={openChatInfo}>
          <Icons.chevron_left className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default InboxChatSectionHeader;
