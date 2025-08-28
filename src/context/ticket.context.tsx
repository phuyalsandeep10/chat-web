'use client';

import { baseURL } from '@/apiConfigs/axiosInstance';
import { useMessageAudio } from '@/hooks/useMessageAudio.hook';
import { AuthService } from '@/services/auth/auth';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
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
    ticket_id?: number;
  };
  transports: string[];
  path: string;
  autoConnect?: boolean;
  namespace?: string;
}

export const TicketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketUrl, setSocketUrl] = useState(`${baseURL}/tickets`);
  const [socketId, setSocketId] = useState<string | undefined>('');
  const { authData } = useAuthStore();

  // Use the new useAudio hook
  const { playSound } = useMessageAudio();

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
      namespace: '/tickets',
      auth: {
        ticket_id: 1,
        token: accessToken,
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
  }, [playSound, socket, socketUrl]);

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

export const useTicketSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useTicketSocket must be used within a SocketProvider');
  }
  return context;
};
