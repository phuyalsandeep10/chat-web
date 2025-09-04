'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getConversation } from '@/services/ticket/conversation';
import { useTicketSocket } from '@/context/ticket.context';
import { Textarea } from '@/components/ui/textarea';
import LanguageSelector from '@/components/custom-components/Inbox/InboxChatSection/LanguageSelector';
import { Button } from '@/components/ui/button';
import TicketDetailsHeader from '../components/details/TicketDetailsHeader';
import TicketRightSidebar from '../components/details/TicketDetailsSidebar';
import { SendMessagePayload, Ticket } from '@/services/ticket/ticketTypes';
import { TicketService } from '@/services/ticket/ticketServices';
import Conversation from './components/Conversation';
import Editor from '@/shared/Editor/Editor';

const TicketDetails = () => {
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversationData, setConversationData] = useState<Ticket[]>([]);
  const [receiver, setReceiver] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [oldestMessageId, setOldestMessageId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // New states for editing
  const [editingId, setEditingId] = useState<number | null>(null);

  const params: any = useParams();
  const ticketId = params?.ticketId;
  const { socket } = useTicketSocket();

  useEffect(() => {
    if (!socket || !ticketId) return;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const ticketResponse = await TicketService.getTicketDetails(ticketId);
        setTicket(ticketResponse.data);

        const receiverEmail =
          ticketResponse.data?.customer?.email ||
          ticketResponse.data?.customer_email;
        setReceiver(receiverEmail);

        const conversationResponse = await getConversation(ticketId, 10);
        const messages = conversationResponse?.data || [];
        console.log('Initial conversation data:', messages);
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

  const handleUpdateTicket = (updatedTicket: any) => {
    setTicket((prev: any) => ({ ...prev, ...updatedTicket }));
  };

  const loadMoreMessages = useCallback(async () => {
    if (isLoadingMore || !hasMore || !oldestMessageId) return;

    try {
      setIsLoadingMore(true);
      const response = await getConversation(ticketId, 10, oldestMessageId);
      const olderMessages = response?.data || [];
      console.log('Loaded more messages:', olderMessages);
      setConversationData((prev) => [...olderMessages, ...prev]);
      setOldestMessageId(olderMessages[0].id || null);
      setHasMore(olderMessages.length === 10);
    } catch (err: any) {
      console.error('Error loading more messages:', err.message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [ticketId, isLoadingMore, hasMore, oldestMessageId]);

  useEffect(() => {
    const handleIncomingMessage = (data: any) => {
      console.log('Socket message received:', data);
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
  }, [socket, ticket?.created_by?.email, ticketId]);

  // Handle Send / Update
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    console.log('handleSendMessage called - editingId:', editingId);

    if (editingId) {
      console.log('Updating message with ID:', editingId);
      try {
        await TicketService.updateTicketMessage({
          message_id: editingId,
          content: message,
        });
        setConversationData((prev) =>
          prev.map((m) =>
            m.id === editingId ? { ...m, content: message, isEdited: true } : m,
          ),
        );
        setEditingId(null);
        setMessage('');
      } catch (err: any) {
        console.error('Error updating message:', err.message);
      }
    } else {
      console.log('Sending new message');
      const payload: SendMessagePayload = {
        ticket_id: ticketId,
        receiver: receiver,
        content: message,
      };

      try {
        const response = await TicketService.postTicketDetails(payload);

        const newMessage: Ticket = {
          id: response.data.id,
          sender: response.data.sender || ticket?.created_by?.email || 'You',
          content: message,
          created_at: response.data.created_at || new Date().toISOString(),
          direction: 'outgoing',
        };

        setConversationData((prev) => [...prev, newMessage]);
        setMessage('');
      } catch (err: any) {
        console.error(err.message);
      }
    }
  };

  // Callback passed to Conversation
  const handleEditMessage = (msg: Ticket) => {
    console.log(
      'handleEditMessage received - Message ID:',
      msg.id,
      'Full message:',
      msg,
    );
    if (msg.id) {
      setEditingId(msg.id);
      setMessage(msg.content);
    } else {
      console.error('Cannot edit message without ID:', msg);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setMessage('');
  };

  if (!socket || !ticketId) return null;
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex h-screen overflow-y-scroll">
      {/* Main Content */}
      <div
        className={`flex-1 py-4 transition-all duration-300 ${
          sidebarOpen ? 'mr-[380px]' : ''
        }`}
      >
        <TicketDetailsHeader
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          ticketId={ticketId}
          ticket={ticket}
          onUpdateTicket={handleUpdateTicket}
        />
        {/* <LanguageSelector /> */}
        <Conversation
          conversationData={conversationData}
          onLoadMore={loadMoreMessages}
          hasMore={hasMore}
          isLoading={isLoadingMore}
          onEditMessage={handleEditMessage}
        />

        <div className="px-10">
          <Editor
            value={message}
            onChange={setMessage}
            isEditing={!!editingId}
            messageId={editingId?.toString() || null}
            onSubmit={async () => {
              if (!message.trim()) return;

              // Handle Update
              if (editingId) {
                try {
                  await TicketService.updateTicketMessage({
                    message_id: editingId,
                    content: message,
                  });
                  setConversationData((prev) =>
                    prev.map((m) =>
                      m.id === editingId
                        ? { ...m, content: message, isEdited: true }
                        : m,
                    ),
                  );
                  setEditingId(null);
                  setMessage('');
                } catch (err: any) {
                  console.error('Error updating message:', err.message);
                }
              }
              // Handle Send
              else {
                const payload: SendMessagePayload = {
                  ticket_id: ticketId,
                  receiver,
                  content: message,
                };

                try {
                  const response =
                    await TicketService.postTicketDetails(payload);
                  const newMessage: Ticket = {
                    id: response.data.id,
                    sender:
                      response.data.sender ||
                      ticket?.created_by?.email ||
                      'You',
                    content: message,
                    created_at:
                      response.data.created_at || new Date().toISOString(),
                    direction: 'outgoing',
                  };
                  setConversationData((prev) => [...prev, newMessage]);
                  setMessage('');
                } catch (err: any) {
                  console.error(err.message);
                }
              }
            }}
          />
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[400px] bg-white transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <TicketRightSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          ticket={ticket}
        />
      </div>
    </div>
  );
};

export default TicketDetails;
