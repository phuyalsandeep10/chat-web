'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  getTicketDetails,
  postTicketDetails,
  SendMessagePayload,
} from '@/services/ticket/services';
import { getConversation } from '@/services/ticket/conversation';
import { useTicketSocket } from '@/context/ticket.context';
import { Textarea } from '@/components/ui/textarea';
import LanguageSelector from '@/components/custom-components/Inbox/InboxChatSection/LanguageSelector';
import { Button } from '@/components/ui/button';
import Conversation, { Ticket } from './components/Conversation';
import TicketDetailsHeader from '../components/details/TicketDetailsHeader';
import TicketRightSidebar from '../components/details/TicketDetailsSidebar';

const TicketDetails = () => {
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversationData, setConversationData] = useState<Ticket[]>([]);
  const [receiver, setReceiver] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

    return () => {
      socket?.off('ticket_broadcast', handleIncomingMessage);
    };
  }, [ticketId, ticket?.created_by?.email, socket]);

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
    <div className="flex h-screen overflow-hidden">
      {/* Main Content */}
      <div
        className={`flex-1 py-4 transition-all duration-300 ${
          sidebarOpen ? 'mr-[400px]' : ''
        }`}
      >
        <TicketDetailsHeader
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          ticketId={Number(ticketId)}
        />
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

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[400px] bg-white shadow-lg transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <TicketRightSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          ticketId={Number(ticketId)}
        />
      </div>
    </div>
  );
};

export default TicketDetails;
