'use client';
import { baseURL } from '@/apiConfigs/axiosInstance';
import { CustomerConversationService } from '@/services/inbox/customerConversation.service';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  content: string;
  user_id?: number;
  mode?: 'message' | 'typing';
  organization_id?: number;
  conversation_id?: number;
  customer_id?: number;
}

interface socketOptions {
  auth: {
    token?: string;
    customer_id?: number;
    conversation_id?: number;
    organization_id?: number;
  };
  transports: string[];
  path: string;
  autoConnect?: boolean;
  namespace?: string;
}

export default function ChatBox({ visitor }: { visitor: any }) {
  const [socketUrl, setSocketUrl] = useState(`${baseURL}/chat`);
  const [authToken, setAuthToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const [socketId, setSocketId] = useState<string | undefined>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const connectSocket = () => {
    if (socket) {
      socket.disconnect();
    }

    const socketOptions: socketOptions = {
      transports: ['websocket', 'polling'],
      path: '/ws/sockets/socket.io',
      namespace: '/chat',
      auth: {
        customer_id: visitor?.customer?.id,
        conversation_id: visitor?.conversation?.id,
        organization_id: visitor?.customer?.organization_id,
      },
    };

    if (authToken.trim()) {
      socketOptions.auth.token = authToken.trim();
    }

    try {
      const newSocket = io(socketUrl, socketOptions);

      newSocket.on('connect', () => {
        setSocketId(newSocket.id);
        setIsConnected(true);
        console.log('Connected to:', socketUrl);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Disconnected from:', socketUrl);
      });

      newSocket.on('receive-message', (data: Message) => {
        if (!data?.user_id) return;
        setMessages((prev) => [...prev, data]);
        console.log('Received message:', data);
      });

      newSocket.on('message_seen', (data) => {
        console.log('message_seen', data);
      });

      newSocket.on('typing', () => {
        console.log('typing ...');
        setOtherTyping(true);
      });

      newSocket.on('stop-typing', () => {
        console.log('stop typing ...');
        setOtherTyping(false);
      });

      setSocket(newSocket);
    } catch (error) {
      console.error('Failed to connect socket:', error);
    }
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setSocketId('');
      setMessages([]);
      setOtherTyping(false);
    }
  };

  const getConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res =
        await CustomerConversationService.getCustomerAllChatConversationMessages(
          visitor.conversation.id,
        );
      setMessages(res?.data || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      setError(
        'Failed to fetch conversations. Please check your connection or authentication.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    connectSocket();
    getConversations();
    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, otherTyping]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!socket || !isConnected || !message.trim()) return;

    const messageData: Message = {
      content: message,
      mode: 'message',
      organization_id: 1,
      conversation_id: 1,
      customer_id: 1,
    };

    try {
      socket.emit('message', messageData);
      const res =
        await CustomerConversationService.createCustomerConversationWithAgent(
          visitor?.conversation?.id,
          { content: message },
        );

      setMessages((prev) => [...prev, res?.data]);
      setMessage('');
      setIsTyping(false);

      if (typingTimeout) {
        clearTimeout(typingTimeout);
        setTypingTimeout(null);
      }
      emitStopTyping();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const emitTyping = () => {
    if (!socket || !isConnected) return;
    socket.emit('typing', {
      mode: 'typing',
      conversation_id: visitor.conversation.id,
      organization_id: visitor.conversation.organization_id,
      message: message,
    });
  };

  const emitStopTyping = () => {
    if (!socket || !isConnected) return;
    console.log('stop typing....');
    socket.emit('stop_typing', { conversation_id: visitor.conversation.id });
  };

  return (
    <div className="mx-auto flex h-screen max-w-2xl flex-col p-4">
      <h1 className="mb-4 text-center text-2xl font-bold">
        Socket.IO Chat Client
      </h1>

      <div className="mb-4 flex-1 space-y-2 overflow-y-auto rounded border border-gray-300 bg-gray-50 p-4">
        {!isConnected && (
          <div className="mt-8 text-center text-gray-500">
            Please connect to a socket server to start chatting
          </div>
        )}
        {loading && (
          <div className="text-center text-gray-500">
            Loading conversations...
          </div>
        )}
        {error && <div className="text-center text-red-500">{error}</div>}
        {!loading && !error && messages.length === 0 && (
          <div className="mt-8 text-center text-gray-500">No messages yet.</div>
        )}
        {messages.map((msg: any, index: number) => (
          <MessageItem message={msg} key={msg?.id} socket={socket} />
        ))}
        {otherTyping && (
          <div className="text-sm text-gray-500 italic">
            Someone is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            console.log({ socket, isConnected });
            if (!socket || !isConnected) return;

            if (e.target.value.trim()) {
              setIsTyping(true);
              emitTyping();
            }

            if (isTyping && !e.target.value.trim()) {
              console.log('Hello typing....', isTyping);
              emitStopTyping();
              setIsTyping(false);
            }

            if (typingTimeout) clearTimeout(typingTimeout);

            const timeout = setTimeout(() => {
              setIsTyping(false);
              emitStopTyping();
            }, 1000);

            setTypingTimeout(timeout);
          }}
          onBlur={() => {
            emitStopTyping();
          }}
          placeholder="Type your message..."
          className="flex-1 rounded border border-gray-300 p-2"
          disabled={!isConnected}
        />
        <button
          type="submit"
          disabled={!isConnected || !message.trim()}
          className={`rounded px-4 py-2 ${
            !isConnected || !message.trim()
              ? 'cursor-not-allowed bg-gray-300 text-gray-500'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          Send
        </button>
      </form>
      {/* <button
        className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={getConversations}
      >
        Get Conversations
      </button> */}
    </div>
  );
}

const MessageItem = ({ socket, message }: any) => {
  useEffect(() => {
    if (!socket) return;
    if (!!message?.user_id && !message?.seen) {
      socket.emit('message_seen', {
        message_id: message?.id,
      });
    }
  }, [message]);

  return (
    <div
      className={`rounded p-3 break-words ${
        !!message?.user_id
          ? 'mr-auto self-start bg-gray-200 text-black'
          : 'ml-auto self-end bg-blue-500 text-white'
      } max-w-xs`}
    >
      {message?.content}
    </div>
  );
};
