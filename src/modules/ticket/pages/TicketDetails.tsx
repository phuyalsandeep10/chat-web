'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  getTicketDetails,
  postTicketDetails,
  SendMessagePayload,
} from '@/services/ticket/services';
import { getConversation } from '@/services/ticket/conversation';
import { TicketProvider, useTicketSocket } from '@/context/ticket.context';
import { Textarea } from '@/components/ui/textarea';
import LanguageSelector from '@/components/custom-components/Inbox/InboxChatSection/LanguageSelector';
import { Button } from '@/components/ui/button';
import Conversation, { Ticket } from './components/Conversation';

const TicketDetails = () => {
  const router = useRouter();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversationData, setConversationData] = useState<Ticket[]>([]);
  const [receiver, setReceiver] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [oldestMessageId, setOldestMessageId] = useState<number | null>(null);

  const params: any = useParams();
  const ticketId = params?.ticketId;
  const { socket } = useTicketSocket();

  useEffect(() => {
    if (!socket || !ticketId) return;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const ticketResponse = await getTicketDetails(ticketId);
        setTicket(ticketResponse.data);

        const receiverEmail = ticketResponse.data.customer_email || '';
        setReceiver(receiverEmail);

        const conversationResponse = await getConversation(ticketId, 10);
        const messages = conversationResponse?.data || [];
        setConversationData(messages);

        if (messages.length > 0) {
          setOldestMessageId(messages[0].id || null);
          setHasMore(messages.length === 10);
        } else {
          setHasMore(false);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [socket, ticketId]);

  const loadMoreMessages = useCallback(async () => {
    if (isLoadingMore || !hasMore || !oldestMessageId) return;

    try {
      setIsLoadingMore(true);
      const response = await getConversation(ticketId, 10, oldestMessageId);
      const olderMessages = response?.data || [];

      if (olderMessages.length > 0) {
        setConversationData((prev) => [...olderMessages, ...prev]);
        setOldestMessageId(olderMessages[0].id || null);
        setHasMore(olderMessages.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      console.error('Error loading more messages:', err.message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [ticketId, isLoadingMore, hasMore, oldestMessageId]);

  useEffect(() => {
    const handleIncomingMessage = (data: any) => {
      console.log('hey there');
      const normalized: Ticket = {
        id: data.id,
        sender: data.user,
        content: data.message,
        created_at: data.created_at,
        direction:
          data.user === ticket?.created_by?.email ? 'outgoing' : 'incoming',
      };
      setConversationData((prev) => [...prev, normalized]);
    };

    socket?.on('ticket_broadcast', handleIncomingMessage);

    return () => {
      socket?.off('ticket_broadcast', handleIncomingMessage);
    };
  }, [socket, ticket?.created_by?.email]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const payload: SendMessagePayload = {
      ticket_id: ticketId,
      receiver: receiver,
      content: message,
    };

    try {
      await postTicketDetails(payload);
      const newMessage: Ticket = {
        sender: ticket?.created_by?.email || 'You',
        content: message,
        created_at: new Date().toISOString(),
        direction: 'outgoing',
      };
      setConversationData((prev) => [...prev, newMessage]);
      setMessage('');
    } catch (err: any) {
      console.error(err.message);
    }
  };

  if (!socket || !ticketId) return null;
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Ticket Details</h2>
      <LanguageSelector />
      <Conversation
        conversationData={conversationData}
        onLoadMore={loadMoreMessages}
        hasMore={hasMore}
        isLoading={isLoadingMore}
      />

      <div className="mt-4">
        <Textarea
          placeholder="Send your message to Chatboq Team in chat..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="mt-3 flex justify-end">
          <Button type="button" onClick={handleSendMessage}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
