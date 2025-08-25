'use client';

import { baseURL } from '@/apiConfigs/axiosInstance';
import { useMessageAudio } from '@/hooks/useMessageAudio.hook';
import { AuthService } from '@/services/auth/auth';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';
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
    incrementMessageNotificationCount,
    incrementVisitorCount,
    fetchAllConversations,
  } = useAgentConversationStore();

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
        console.log('Connected to:', socketUrl);
      });

      newSocket.on('customer_land', (data: Message) => {
        console.log('Customer land:', data);
        playSound();
        incrementVisitorCount();
        fetchAllConversations();
      });

      newSocket.on('message-notification', (data: Message) => {
        console.log('Message notification:', data);
        playSound();
        incrementMessageNotificationCount();
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Disconnected from:', socketUrl);
      });

      // typing: listen

      setSocket(newSocket);
    } catch (error) {
      console.log({ error });
    }
  }, [playSound, socket, socketUrl]);

  const disconnectSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setSocketId('');
      setMessages([]);
      setOtherTyping(false); // typing: clear typing state
    }
  }, [socket]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // if (!authTokens) return;
    connectSocket();
    return () => {
      disconnectSocket();
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
