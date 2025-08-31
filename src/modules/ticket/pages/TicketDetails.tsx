'use client';
import React, { useEffect, useState } from 'react';
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
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversationData, setConversationData] = useState<Ticket[]>([]);
  const [receiver, setReceiver] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const params: any = useParams();
  const ticketId = params?.ticketId;
  const { socket } = useTicketSocket();

  useEffect(() => {
    if (!socket || !ticketId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const ticketResponse = await getTicketDetails(ticketId);
        setTicket(ticketResponse.data);

        const receiverEmail = ticketResponse.data.customer_email || '';
        setReceiver(receiverEmail);

        const conversationResponse = await getConversation(ticketId);
        setConversationData(conversationResponse?.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [socket, ticketId, ticket?.sender]);

  useEffect(() => {
    const handleIncomingMessage = (data: any) => {
      console.log('hey there');
      const normalized: Ticket = {
        sender: data.user,
        content: data.message,
        created_at: data.created_at,
        direction:
          data.user === ticket?.created_by?.email ? 'outgoing' : 'incoming',
      };
      setConversationData((prev) => [...prev, normalized]);
    };

    socket?.on('ticket_broadcast', handleIncomingMessage);
  }, [ticketId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const payload: SendMessagePayload = {
      ticket_id: ticketId,
      receiver: receiver,
      content: message,
    };

    try {
      await postTicketDetails(payload);
      setConversationData((prev) => [
        ...prev,
        {
          sender: ticket?.created_by?.email || 'You',
          content: message,
          created_at: new Date().toISOString(),
          direction: 'outgoing',
        },
      ]);
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
      <Conversation conversationData={conversationData} />

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
