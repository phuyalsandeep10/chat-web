'use client';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';
import { Badge } from '@/components/ui/badge';
import { getStatusColor } from './getColorsHelper';
import ShowTime from '@/lib/timeFormatUtils';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';
import { useUiStore } from '@/store/UiStore/useUiStore';

const ConversationsList = () => {
  const { activeTab, setActiveTab } = useUiStore();

  const { all_conversations, fetchAllConversations, req_loading } =
    useAgentConversationStore();

  // Fetch all conversations when the component mounts
  useEffect(() => {
    // console.log('Fetching all conversations');
    fetchAllConversations();
  }, [fetchAllConversations]);

  // Filter conversations based on activeTab
  const filteredConversations = all_conversations?.filter(
    (conversation: any) =>
      activeTab === 'Unresolved'
        ? !conversation.is_resolved
        : conversation.is_resolved,
  );

  // console.log(filteredConversations);

  return (
    <>
      <div className="mt-5 flex border-b">
        <button
          className={`flex-1 pb-1 text-center font-semibold ${
            activeTab === 'Unresolved'
              ? 'text-error border-error border-b'
              : 'text-theme-text-primary'
          }`}
          onClick={() => setActiveTab('Unresolved')}
        >
          Unresolved
        </button>
        <button
          className={`flex-1 pb-1 text-center text-base font-semibold ${
            activeTab === 'Resolved'
              ? 'text-error border-error border-b'
              : 'text-theme-text-primary'
          }`}
          onClick={() => setActiveTab('Resolved')}
        >
          Resolved
        </button>
      </div>

      <div className="max-h-[calc(100vh-185px)] min-h-[calc(100vh-185px)] overflow-y-auto pt-5">
        {req_loading.fetch_all_conversations ? (
          <p className="mt-5 text-center text-gray-500">
            Loading conversations...
          </p>
        ) : filteredConversations?.length > 0 ? (
          filteredConversations.map((conversation: any) => (
            <Link
              href={`/inbox/${conversation?.id}`}
              key={conversation?.id}
              className=""
            >
              <div className="border-gray-light border-b-theme-text-primary flex items-center border-b py-4">
                <Avatar>
                  {conversation?.customer?.image ? (
                    <AvatarImage
                      src={conversation?.customer?.image}
                      alt="Image"
                      className="h-[30px] w-[30px] rounded-full"
                    />
                  ) : (
                    <AvatarFallback className="text-theme-text-primary min-h-[30px] min-w-[30px] rounded-full text-xs font-semibold">
                      {conversation?.customer?.name?.slice(0, 2)?.toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="ml-2 min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-theme-text-dark truncate text-base font-semibold">
                      {conversation?.customer?.name || 'Unknown'}
                    </h3>
                    <span className="text-theme-text-primary ml-1 text-sm leading-17">
                      {ShowTime(
                        conversation?.attributes?.last_message?.updated_at,
                      )}
                    </span>
                  </div>

                  <p className="text-theme-text-primary my-1 truncate text-sm">
                    {conversation.attributes?.last_message?.content ||
                      'No message'}
                  </p>

                  <div className="flex items-center gap-3">
                    {/* <div className="flex h-5 w-5 items-center justify-center rounded-full">
                      <Icons.whatsapp className="fill-success h-5 w-5 text-white" />
                    </div> */}
                    <Badge
                      className={`rounded-2xl px-2 py-1 text-xs font-semibold ${getStatusColor(
                        conversation.is_resolved ? 'Resolved' : 'Unresolved',
                      )}`}
                    >
                      {conversation.is_resolved ? 'Resolved' : 'Unresolved'}
                    </Badge>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="mt-5 text-center text-gray-500">
            No {activeTab.toLowerCase()} conversations
          </p>
        )}
      </div>
    </>
  );
};

export default ConversationsList;
