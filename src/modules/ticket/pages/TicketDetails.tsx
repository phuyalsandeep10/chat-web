'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTicketDetails } from '@/services/ticket/services';
import { getConversation } from '@/services/ticket/conversation';
import { useTicketSocket } from '@/context/ticket.context';
import { parseISO, format, addMinutes, isToday, isYesterday } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import LanguageSelector from '@/components/custom-components/Inbox/InboxChatSection/LanguageSelector';
import { Button } from '@/components/ui/button';

export interface Ticket {
  id?: number;
  sender: string;
  receiver?: string;
  content: string;
  direction: 'incoming' | 'outgoing';
  created_at: string;
}

const TicketDetails = () => {
  const router = useRouter();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversationData, setConversationData] = useState<Ticket[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const params: any = useParams();
  const ticketId = params?.ticketId;
  const { socket } = useTicketSocket();

  // Format time to Nepal local time
  const formatTime = (isoDate: string) => {
    try {
      const date = parseISO(isoDate);
      const nepaliTime = addMinutes(date, 345);
      return format(nepaliTime, 'hh:mm a');
    } catch {
      return '--:--';
    }
  };

  // Format date header
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

  useEffect(() => {
    if (!socket || !ticketId) return;

    const handleIncomingMessage = (data: any) => {
      const normalized: Ticket = {
        sender: data.user,
        content: data.message,
        created_at: data.created_at,
        direction: data.user === ticket?.sender ? 'outgoing' : 'incoming',
      };
      setConversationData((prev) => [...prev, normalized]);
    };

    socket.on('ticket_broadcast', handleIncomingMessage);

    const fetchData = async () => {
      try {
        setLoading(true);
        const ticketResponse = await getTicketDetails(ticketId);
        setTicket(ticketResponse);

        const conversationResponse = await getConversation(ticketId);
        setConversationData(conversationResponse?.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      socket.off('ticket_broadcast', handleIncomingMessage);
    };
  }, [socket, ticketId, ticket?.sender]);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [conversationData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  let lastDateHeader = '';

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Ticket Details</h2>
      <LanguageSelector />
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
                    msg.direction === 'outgoing'
                      ? 'justify-start'
                      : 'justify-end'
                  }`}
                >
                  <Image
                    src="/chatboq-logo.png"
                    alt="Profile"
                    width={50}
                    height={50}
                    className="h-12.5 w-12.5 rounded-full border border-[#D4D4D4]"
                  />
                  <div
                    className={`relative rounded-xl px-7 py-2.5 break-words shadow-md ${
                      msg.direction === 'outgoing'
                        ? 'bg-[#C9C9F7] text-black'
                        : 'bg-brand-primary text-white'
                    }`}
                  >
                    <p className="text-lg">{msg.content}</p>
                    <p
                      className={`text-base font-normal ${
                        msg.direction === 'outgoing'
                          ? 'text-left text-[#71717A]'
                          : 'text-right text-[#D4D4D4]'
                      }`}
                    >
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        ) : (
          <p>No conversation data available.</p>
        )}
      </div>
      <div className="mt-4">
        <Textarea placeholder="Send your message to Chatboq Team in chat..." />
        <div className="mt-3 flex justify-end">
          <Button type="button" leftIcon="" onClick={() => 'clicked'}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
