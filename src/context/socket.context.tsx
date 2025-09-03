'use client';

import { baseURL } from '@/apiConfigs/axiosInstance';
import { CHAT_EVENTS } from '@/events/InboxEvents';
import { useMessageAudio } from '@/hooks/useMessageAudio.hook';
import { AuthService } from '@/services/auth/auth';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';
import { useUiStore } from '@/store/UiStore/useUiStore';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Socket, io } from 'socket.io-client';

interface Message {
  message: string;
  from?: string;
  mode?: 'message' | 'typing';
}

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

interface socketOptions {
  auth: {
    token?: string;
    customer_id?: number;
    conversation_id?: number;
  };
  transports: string[];
  path: string;
  autoConnect?: boolean;
  namespace?: string;
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [authToken, setAuthToken] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketUrl, setSocketUrl] = useState(`${baseURL}/agent-chat`);
  const [socketId, setSocketId] = useState<string | undefined>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherTyping, setOtherTyping] = useState(false);
  const { authData } = useAuthStore();

  // Use the new useAudio hook
  const { playSound } = useMessageAudio();
  const {
    // fetchAllConversations,
    setCustomerIsOnlineOffline,
    setConversationUnresolved,
    updateConversationLastMessage,
    insertConversation,
  } = useAgentConversationStore();
  const handleCustomerJoinConversation = (data: any) => {
    console.log('Customer join conversation', data);
    insertConversation(data?.conversation);
  };
  const connectSocket = useCallback(() => {
    if (typeof window === 'undefined') return;
    const authTokens = AuthService.getAuthTokens();
    if (!authTokens) return;
    const { accessToken } = authTokens;

    if (socket) {
      socket.disconnect();
    }

    const socketOptions: socketOptions = {
      transports: ['websocket', 'polling'],
      path: '/ws/sockets/socket.io',
      namespace: '/agent-chat',
      auth: {
        customer_id: 1,
        conversation_id: 1,
      },
    };

    if (accessToken.trim()) {
      socketOptions.auth = {
        token: accessToken.trim(),
      };
    }

    try {
      const newSocket = io(socketUrl, socketOptions);

      newSocket.on('connect', () => {
        setSocketId(newSocket.id);
        setIsConnected(true);
        // console.log('Connected to:', socketUrl);
      });

      newSocket.on(CHAT_EVENTS.customer_land, (data: Message) => {
        // console.log('Customer land:', data);
        playSound();
        setCustomerIsOnlineOffline(data);
        // fetchAllConversations();
      });
      newSocket.on(CHAT_EVENTS.resolved_conversation, (data: Message) => {
        // console.log('unresolved conversation:', data);
        // playSound();
      });
      newSocket.on(
        CHAT_EVENTS.customer_conversation_join,
        handleCustomerJoinConversation,
      );

      newSocket.on(CHAT_EVENTS.message_notification, (data: Message) => {
        console.log('Message notification:', data);
        playSound();
        updateConversationLastMessage(data);
      });
      newSocket.on(CHAT_EVENTS.customer_disconnected, (data) => {
        // console.log('customer disconnected', data);
        setCustomerIsOnlineOffline(data);
      });

      newSocket.on(CHAT_EVENTS.unresolve_conversation, (data) => {
        // console.log('unresolved data', data);
        setConversationUnresolved({
          conversation_id: data?.id,
          is_resolved: data?.is_resolved,
        });
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        // console.log('Disconnected from:', socketUrl);
      });

      // typing: listen

      setSocket(newSocket);
    } catch (error) {
      console.log({ error });
    }
  }, [playSound, socket, socketUrl]);

  const handleCleanup = () => {
    console.log('cleanup message notification ');
  };

  const cleanupSocketListeners = () => {
    if (!socket) return;
    socket.off(CHAT_EVENTS.message_notification, handleCleanup);
    socket.off(CHAT_EVENTS.customer_land, handleCleanup);
  };

  const disconnectSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setSocketId('');
      setMessages([]);
      setOtherTyping(false); // typing: clear typing state
      cleanupSocketListeners();
    }
  }, [socket]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // if (!authTokens) return;
    cleanupSocketListeners();
    connectSocket();

    return () => {
      disconnectSocket();
      cleanupSocketListeners();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
