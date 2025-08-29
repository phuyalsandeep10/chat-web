import React, { useEffect, useMemo, useRef } from 'react';
import MessageItem from './MessageList/MessageItem';
import InboxChatSectionHeader from './InboxChatSectionHeader';
import { useUiStore } from '@/store/UiStore/useUiStore';
import { Message } from '@/store/inbox/types';

interface InboxChatSectionProps {
  messages: Message[];
  onReply: (messageText: string) => void;
  handleEditMessage: (messageText: string) => void;
  showTyping: boolean;
  typingmessage: string;
}

const InboxChatSection = ({
  messages,
  onReply,
  handleEditMessage,
  showTyping,
  typingmessage,
}: InboxChatSectionProps) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const groupedMessages = useMemo(() => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach((message) => {
      const date = new Date(message.created_at);
      if (isNaN(date.getTime())) return; // Skip invalid dates
      const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., "Sun"
      if (!groups[dayKey]) {
        groups[dayKey] = [];
      }
      groups[dayKey].push(message);
    });
    return groups;
  }, [messages]);

  const sortedDays = useMemo(() => {
    const dayKeys = Object.keys(groupedMessages);
    return dayKeys.sort((a, b) => {
      const earliestA = groupedMessages[a].reduce((min, msg) => {
        const date = new Date(msg.created_at);
        return date < min ? date : min;
      }, new Date(Number.MAX_SAFE_INTEGER));
      const earliestB = groupedMessages[b].reduce((min, msg) => {
        const date = new Date(msg.created_at);
        return date < min ? date : min;
      }, new Date(Number.MAX_SAFE_INTEGER));
      return earliestA.getTime() - earliestB.getTime();
    });
  }, [groupedMessages]);

  return (
    <div className="flex-1 p-4">
      <InboxChatSectionHeader />
      {/* <LanguageSelector /> */}
      <div className="max-h-[calc(100vh-280px)] min-h-[calc(100vh-280px)] space-y-4 overflow-y-auto py-10">
        {sortedDays.map((day) => (
          <div key={day}>
            <div className="flex items-center gap-1.5">
              <div className="bg-gray-light h-[1px] flex-1"></div>
              <h2 className="text-theme-text-primary text-xs leading-[17px] font-normal">
                {day}
              </h2>
              <div className="bg-gray-light h-[1px] flex-1"></div>
            </div>

            {groupedMessages[day].map((message, index) => (
              <MessageItem
                key={`${day}-${message.id || index}`}
                message={message}
                onReply={onReply}
                handleEditMessage={handleEditMessage}
                showTyping={showTyping}
                typingmessage={typingmessage}
              />
            ))}
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default InboxChatSection;
