'use client';
import { Icons } from '@/components/ui/Icons';
import { ROUTES } from '@/routes/routes';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';
import { useUiStore } from '@/store/UiStore/useUiStore';
import { useRouter } from 'next/navigation';
import React from 'react';

const InboxChatSectionHeader = () => {
  const { openChatInfo } = useUiStore();
  const { customer, conversation, resolveConversation, req_loading } =
    useAgentConversationStore();
  const router = useRouter();

  return (
    <div className="flex items-center justify-between border-b bg-white p-4">
      <div className="flex items-center space-x-3">
        <div className="bg-gray-light flex h-10 w-10 items-center justify-center rounded-full">
          <span className="text-theme-text-dark text-sm font-medium">
            {customer?.name?.substring(0, 2)?.toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-theme-text-dark font-medium">{customer?.name}</h2>
          <p className="text-theme-text-dark text-sm">{customer?.email}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
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
      </div>
    </div>
  );
};

export default InboxChatSectionHeader;
