'use client';
import React, { useEffect, useRef } from 'react';
import { useUiStore } from '@/store/UiStore/useUiStore';
import InboxChatSectionHeader from '@/components/custom-components/Inbox/InboxChatSection/InboxChatSectionHeader';
import MessageItem from '@/components/custom-components/Inbox/InboxChatSection/MessageList/MessageItem';
import { Message } from '../../pages/types';

interface TicketInboxProps {
  messages?: Message[];
  onReply: (messageText: string) => void;
}

const TicketInbox = ({ messages, onReply }: TicketInboxProps) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 p-4">
      <div className="max-h-[calc(100vh-280px)] min-h-[calc(100vh-280px)] space-y-4 overflow-y-auto py-10">
        {messages?.map((message, index) => (
          <MessageItem key={index} message={message} onReply={onReply} />
        ))}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default TicketInbox;
