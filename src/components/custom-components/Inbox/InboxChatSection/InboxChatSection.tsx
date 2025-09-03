import React, { useEffect, useMemo, useRef } from 'react';
import MessageItem from './MessageList/MessageItem';
import InboxChatSectionHeader from './InboxChatSectionHeader';
import { useUiStore } from '@/store/UiStore/useUiStore';
import { Message } from '@/store/inbox/types';
import DottedAnimation from './MessageList/DottedAnimation';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';

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
  const { customer }: any = useAgentConversationStore();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  useEffect(() => {
    if (showTyping) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showTyping]);

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

            {groupedMessages[day].map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                onReply={onReply}
                handleEditMessage={handleEditMessage}
              />
            ))}
          </div>
        ))}
        {showTyping && typingmessage && (
          <>
            {/* Standalone animations */}
            <div className="mb-4 flex">
              <div className="bg-gray-light mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                <span className="text-theme-text-dark text-xs font-medium">
                  {customer?.name?.substring(0, 2)?.toLocaleUpperCase()}
                </span>
              </div>

              <div className="">
                <div className="w-fit rounded-tl-[16px] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[1px] bg-[#C9C9F7] p-[15.5px]">
                  <DottedAnimation size="sm" color="gray" />
                </div>
                <div className="text-theme-text-primary mt-2 box-border max-h-[119px] min-h-[119px] w-full overflow-y-auto rounded-xl border border-[#D4D4D4] px-5 py-[15px] text-sm leading-[21px] font-medium break-all md:w-[462px]">
                  <div dangerouslySetInnerHTML={{ __html: typingmessage }} />
                </div>
              </div>
            </div>
          </>
        )}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default InboxChatSection;
