'use client';
import React, { useRef, useEffect } from 'react';
import { parseISO, format, addMinutes, isToday, isYesterday } from 'date-fns';

export interface Ticket {
  id?: number;
  sender: string;
  receiver?: string;
  content: string;
  direction: 'incoming' | 'outgoing';
  created_at: string;
}

interface ConversationProps {
  conversationData: Ticket[];
}

const Conversation: React.FC<ConversationProps> = ({ conversationData }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [conversationData]);

  const formatTime = (isoDate: string) => {
    try {
      const date = parseISO(isoDate);
      const nepaliTime = addMinutes(date, 345);
      return format(nepaliTime, 'hh:mm a');
    } catch {
      return '--:--';
    }
  };

  const formatDateHeader = (isoDate: string) => {
    try {
      const date = addMinutes(parseISO(isoDate), 345);
      if (isToday(date)) return 'Today';
      if (isYesterday(date)) return 'Yesterday';
      return format(date, 'dd MMM yyyy');
    } catch {
      return '';
    }
  };

  const getInitials = (sender: string) => {
    const namePart = sender.split('<')[0].trim();
    const names = namePart.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  let lastDateHeader = '';

  return (
    <div
      ref={containerRef}
      className="h-[70vh] space-y-3 overflow-y-auto scroll-smooth"
    >
      {conversationData.length > 0 ? (
        conversationData.map((msg, index) => {
          const dateHeader = formatDateHeader(msg.created_at);
          const showHeader = dateHeader !== lastDateHeader;
          if (showHeader) lastDateHeader = dateHeader;

          return (
            <React.Fragment key={index}>
              {showHeader && (
                <div className="my-4 flex items-center">
                  <div className="flex-grow border-t border-[#D4D4D4]"></div>
                  <span className="mx-2 text-xs font-normal text-[#71717A]">
                    {dateHeader}
                  </span>
                  <div className="flex-grow border-t border-[#D4D4D4]"></div>
                </div>
              )}
              <div
                className={`flex w-full items-center gap-x-4 ${
                  msg.direction === 'outgoing' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.direction === 'outgoing' ? (
                  <>
                    <div className="bg-brand-primary relative rounded-xl px-7 py-2.5 break-words text-white">
                      <p className="text-lg">{msg.content}</p>
                      <p className="text-theme-text-light text-right text-base font-normal">
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                    <div className="bg-brand-primary flex h-12.5 w-12.5 items-center justify-center rounded-full border font-semibold text-white">
                      {getInitials(msg.sender)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-12.5 w-12.5 items-center justify-center rounded-full border bg-[#C9C9F7] font-semibold text-black">
                      {getInitials(msg.sender)}
                    </div>
                    <div className="bg-light-blue relative rounded-xl px-7 py-2.5 break-words text-black">
                      <p className="text-lg">{msg.content}</p>
                      <p className="text-theme-text-primary text-right text-base font-normal">
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </React.Fragment>
          );
        })
      ) : (
        <p>No conversation data available.</p>
      )}
    </div>
  );
};

export default Conversation;
