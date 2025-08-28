'use client';
import React, { useEffect, useState } from 'react';
import TicketInbox from '../components/details/TicketInbox';
import { useParams, useRouter } from 'next/navigation';
import { getTicketDetails } from '@/services/ticket/services';
import { getConversation } from '@/services/ticket/conversation';
import { useTicketSocket } from '@/context/ticket.context';
interface Ticket {
  id: number;
  sender: string;
  receiver: string;
  content: string;
  direction: string;
}

const TicketDetails = () => {
  const router = useRouter();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversationData, setConversationData] = useState<Ticket[]>([]);

  const params: any = useParams();
  const ticketId = params?.ticketId;
  console.log('this is ticketId', ticketId);
  const { socket } = useTicketSocket();

  useEffect(() => {
    if (!ticketId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTicketDetails(ticketId);
        setTicket(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticketId]);

  useEffect(() => {
    socket?.on('on_broadcast', () => {
      console.log('thest test');
    });

    if (!ticketId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getConversation(ticketId);
        console.log(data, 'conversation response');
        setConversationData(data?.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticketId]);

  const handleReply = () => {
    console.log('onreply from ticket');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Ticket Details</h2>

      {/* Conversation messages */}
      <div className="space-y-3">
        {conversationData.length > 0 ? (
          conversationData.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-lg p-3 shadow-md ${
                msg.direction === 'outgoing'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p>
                <span className="font-semibold">From:</span> {msg.sender}
              </p>
              <p>
                <span className="font-semibold">To:</span> {msg.receiver}
              </p>
              <p className="mt-2">{msg.content}</p>
              <p className="mt-2">{msg.direction}</p>
            </div>
          ))
        ) : (
          <p>No conversation data available.</p>
        )}
      </div>

      <TicketInbox onReply={handleReply} />
    </div>
  );
};

export default TicketDetails;
