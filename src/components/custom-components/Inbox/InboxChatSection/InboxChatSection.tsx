import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageList/MessageItem';
import LanguageSelector from './LanguageSelector';
import InboxChatSectionHeader from './InboxChatSectionHeader';
import { useUiStore } from '@/store/UiStore/useUiStore';
import { Message } from '@/store/inbox/types';

interface InboxChatSectionProps {
  messages: Message[];
  onReply: (messageText: string) => void;
}

const InboxChatSection = ({ messages, onReply }: InboxChatSectionProps) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 p-4">
      <InboxChatSectionHeader />
      {/* <LanguageSelector /> */}
      <div className="max-h-[calc(100vh-260px)] min-h-[calc(100vh-260px)] space-y-4 overflow-y-auto py-10">
        {messages?.map((message, index) => (
          <MessageItem key={index} message={message} onReply={onReply} />
        ))}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default InboxChatSection;
