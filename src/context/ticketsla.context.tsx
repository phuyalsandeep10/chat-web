'use client';

import { baseURL } from '@/apiConfigs/axiosInstance';
import { AuthService } from '@/services/auth/auth';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Socket, io } from 'socket.io-client';

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

export const TicketSLASocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketUrl, setSocketUrl] = useState(`${baseURL}/ticket_sla`);
  const [socketId, setSocketId] = useState<string | undefined>('');

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
      namespace: '/ticket_sla',
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

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Disconnected from:', socketUrl);
      });

      setSocket(newSocket);
    } catch (error) {
      console.log({ error });
    }
  }, [socket, socketUrl]);

  const disconnectSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setSocketId('');
    }
  }, [socket]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
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

export const useTickectSlaSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
