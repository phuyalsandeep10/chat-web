'use client';
import React, { useRef, useEffect, useCallback } from 'react';
import { parseISO, isToday, isYesterday } from 'date-fns';
import Dropdown from './Dropdown';

export interface Ticket {
  id?: number;
  sender: string;
  receiver?: string;
  content: string;
  direction: 'incoming' | 'outgoing';
  created_at: string;
  isEdited?: boolean;
}

interface ConversationProps {
  conversationData: Ticket[];
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  onEditMessage: (msg: Ticket) => void;
}

const Conversation: React.FC<ConversationProps> = ({
  conversationData,
  onLoadMore,
  hasMore,
  isLoading,
  onEditMessage,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(conversationData.length);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prevCount = prevMessageCountRef.current;
    const newCount = conversationData.length;

    const isUserAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      50;

    if ((prevCount === 0 || isUserAtBottom) && newCount > prevCount) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }

    prevMessageCountRef.current = newCount;
  }, [conversationData]);

  const handleScroll = useCallback(async () => {
    const container = containerRef.current;
    if (!container || isLoading || !hasMore) return;

    if (container.scrollTop <= 1) {
      const prevScrollHeight = container.scrollHeight;
      await onLoadMore();
      const newScrollHeight = container.scrollHeight;
      container.scrollTop =
        newScrollHeight - prevScrollHeight + container.scrollTop;
    }
  }, [onLoadMore, isLoading, hasMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const normalizeToUtc = (isoDate: string): Date => {
    if (isoDate.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(isoDate)) {
      return new Date(isoDate);
    }
    const cleaned = isoDate.slice(0, 23) + 'Z';
    return new Date(cleaned);
  };

  const formatTime = (isoDate: string) => {
    try {
      const date = normalizeToUtc(isoDate);
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '--:--';
    }
  };

  const formatDateHeader = (isoDate: string) => {
    try {
      const date = normalizeToUtc(isoDate);
      if (isToday(date)) return 'Today';
      if (isYesterday(date)) return 'Yesterday';
      return date.toLocaleDateString([], {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
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
      className="h-[60vh] space-y-3 overflow-y-auto scroll-smooth"
    >
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="text-theme-text-primary text-sm">
            Loading older messages...
          </div>
        </div>
      )}

      {conversationData.length > 0 ? (
        conversationData.map((msg, index) => {
          const dateHeader = formatDateHeader(msg.created_at);
          const showHeader = dateHeader !== lastDateHeader;
          if (showHeader) lastDateHeader = dateHeader;
          const uniqueKey = `${index}-${msg.id || 'no-id'}-${msg.created_at}-${msg.sender.replace(/[^a-zA-Z0-9]/g, '')}`;

          // DEBUG: Log each message to check if id exists
          console.log('Message object:', msg);

          return (
            <React.Fragment key={uniqueKey}>
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
                className={`flex w-full items-center gap-x-4 px-10 ${
                  msg.direction === 'outgoing' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.direction === 'outgoing' ? (
                  <>
                    <div className="group relative max-w-[60%]">
                      <div className="bg-brand-primary relative rounded-xl px-7 py-2.5 break-words text-white">
                        <p className="text-lg">{msg.content}</p>
                        <p className="text-lg">{msg.id}</p>
                        <p className="text-theme-text-light text-right text-base font-normal">
                          {formatTime(msg.created_at)}
                        </p>
                      </div>

                      {/* 3-dot dropdown */}
                      <div
                        className={`absolute top-2 ${
                          msg.direction === 'outgoing' ? '-left-8' : '-right-8'
                        } opacity-0 transition-opacity group-hover:opacity-100`}
                      >
                        <Dropdown
                          items={[
                            {
                              label: 'Edit Message',
                              onClick: () => {
                                console.log(
                                  'Edit clicked - Message ID:',
                                  msg.id,
                                  'Full message:',
                                  msg,
                                );
                                if (msg.id) {
                                  onEditMessage(msg);
                                } else {
                                  console.error(
                                    'Cannot edit message without ID:',
                                    msg,
                                  );
                                }
                              },
                            },
                            {
                              label: 'Delete',
                              onClick: () => console.log('Delete', msg.id),
                              className: 'text-error focus:text-error',
                            },
                          ]}
                        />
                      </div>
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
                    <div className="group relative max-w-[60%]">
                      <div className="bg-light-blue relative rounded-xl px-7 py-2.5 break-words text-black">
                        <p className="text-lg">{msg.content}</p>
                        <p className="text-theme-text-primary text-right text-base font-normal">
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                      {/* 3-dot dropdown */}
                      <div className="absolute top-2 -right-8 opacity-0 transition-opacity group-hover:opacity-100">
                        <Dropdown
                          items={[
                            {
                              label: 'Edit Message',
                              onClick: () => {
                                console.log(
                                  'Edit clicked - Message ID:',
                                  msg.id,
                                  'Full message:',
                                  msg,
                                );
                                onEditMessage(msg);
                              },
                            },
                            // {
                            //   label: 'Delete',
                            //   onClick: () => console.log('Delete', msg.id),
                            //   className: 'text-error focus:text-error',
                            // },
                          ]}
                        />
                      </div>
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
