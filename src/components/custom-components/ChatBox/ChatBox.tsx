'use client';
import { baseURL } from '@/apiConfigs/axiosInstance';
import { formatTime } from '@/lib/timeFormatUtils';
import { cn } from '@/lib/utils';
import { CustomerConversationService } from '@/services/inbox/customerConversation.service';
import { RiMessage2Line } from '@remixicon/react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useChatBox } from './chatbox.provider';
import {
  AttachmentIcon,
  EmojiIcon,
  HomeIcon,
  InfoIcon,
  MaximizeIcon,
  MicIcon,
  SendIcon,
} from './ChatBoxIcons';

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

export default function ChatBox() {
  const { visitor, setVisitor } = useChatBox();
  const [socketUrl, setSocketUrl] = useState(`${baseURL}/chat`);
  const [authToken, setAuthToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const [socketId, setSocketId] = useState<string | undefined>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [expand, setExpand] = useState(false);

  // Use refs for independent timeouts
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stopTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const connectSocket = () => {
    // Disconnect and clean up previous socket if exists
    if (socket) {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('receive_message');
      socket.off('message_seen');
      socket.off('typing');
      socket.off('stop_typing');
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
        token: authToken.trim() || undefined,
      },
      autoConnect: true,
    };

    try {
      const newSocket = io(socketUrl, socketOptions);

      const handleConnect = () => {
        setSocketId(newSocket.id);
        setIsConnected(true);
        console.log('Connected to:', socketUrl);
      };

      const handleDisconnect = () => {
        setIsConnected(false);
        console.log('Disconnected from:', socketUrl);
      };

      const handleMessage = (data: Message) => {
        console.log({ data });
        if (!data?.user_id) return;
        setMessages((prev) => [...prev, data]);
        console.log('Received message:', data);
      };

      // Set up event listeners
      newSocket.on('connect', handleConnect);
      newSocket.on('disconnect', handleDisconnect);
      newSocket.on('receive_message', handleMessage);
      newSocket.on('message_seen', (data) => console.log('message_seen', data));
      newSocket.on('receive_typing', () => setOtherTyping(true));
      newSocket.on('stop_typing', () => setOtherTyping(false));

      // Store cleanup function
      const cleanup = () => {
        newSocket.off('connect', handleConnect);
        newSocket.off('disconnect', handleDisconnect);
        newSocket.off('receive_message', handleMessage);
        newSocket.off('message_seen');
        newSocket.off('receive_typing');
        newSocket.off('stop_typing');
        newSocket.disconnect();
      };

      setSocket(newSocket);
      return cleanup;
    } catch (error) {
      console.error('Failed to connect socket:', error);
      return () => {}; // Return empty cleanup function if connection fails
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
    if (!visitor?.conversation?.id) return;
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
    const cleanup = connectSocket();
    getConversations();
    return () => {
      cleanup?.();
      disconnectSocket();
    };
  }, [visitor?.conversation?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, otherTyping]);

  const initializeConversation = async (data: any) => {
    try {
      const res = await CustomerConversationService.initializeConversation(
        visitor?.customer?.id,
        data,
      );
      const payload = { ...visitor, conversation: res?.data?.conversation };
      setVisitor(payload);
      localStorage.setItem('visitor', JSON.stringify(payload));

      setMessage('');
      setMessages((prev) => [...prev, res?.data?.message]);
    } catch (error) {
      console.error('Failed to initialize conversation:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!socket || !message.trim()) return;
    if (!visitor?.conversation?.id) {
      await initializeConversation({
        customer_id: visitor?.customer?.id,
        organization_id: visitor?.customer?.organization_id,
        content: message,
      });
      return;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    await emitStopTyping();

    try {
      const res =
        await CustomerConversationService.createCustomerConversationWithAgent(
          visitor?.conversation?.id,
          { content: message },
        );

      setMessages((prev) => [...prev, res?.data]);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const emitTyping = (message: string) => {
    if (!socket || !isConnected || !visitor?.conversation?.id) return;
    console.log('typing....');
    socket.emit('typing', {
      mode: 'typing',
      conversation_id: visitor.conversation.id,
      organization_id: visitor.conversation.organization_id,
      message: message,
    });
  };

  const emitStopTyping = async () => {
    if (!socket || !isConnected || !visitor?.conversation?.id) return;
    console.log('stop typing....');
    await socket.emit('stop_typing', {
      conversation_id: visitor.conversation.id,
    });
  };

  // if (!visitor?.customer?.email) {
  //   return (
  //     <div className="mx-auto flex h-screen max-w-2xl flex-col items-center justify-center p-4">
  //       <CustomerUpdateForm />
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="fixed right-4 bottom-4 z-50 overflow-hidden rounded-xl">
        {/* Floating button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex min-h-[42px] min-w-[42px] cursor-pointer items-center justify-center rounded-full bg-[#5A189A] shadow-lg transition hover:bg-[#5A189A]"
          >
            <Image
              src="/widget-logo.svg"
              height={24}
              width={20}
              className="h-6 w-6"
              alt="chatboq bot logo"
            />
          </button>
        )}
        {isOpen && (
          <div
            className={cn(
              `w-[360px] rounded-xl bg-[#FAFAFA]`,
              expand && 'w-[1024px] transition-all',
            )}
          >
            <div className="flex items-center justify-between bg-gradient-to-b from-[#6D28D9] to-[#A77EE8] px-6 py-2">
              <div className="left flex items-center gap-4">
                <div className="flex min-h-[42px] min-w-[42px] items-center justify-center rounded-full bg-[#5A189A]">
                  <Image
                    src="/widget-logo.svg"
                    height={24}
                    width={20}
                    className="h-6 w-6"
                    alt=""
                  />
                </div>
                <div className="">
                  <h3 className="font-sans text-[20px] leading-6 font-medium text-white">
                    ChatBoq
                  </h3>
                  <p className="font-inter text-[11px] leading-[16.5px] font-normal text-white">
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-[14px] text-white">
                <button
                  onClick={() => setExpand(!expand)}
                  className="cursor-pointer"
                >
                  <MaximizeIcon />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div
              className={cn(
                `max-h-[413px] min-h-[413px] overflow-auto px-6 py-4`,
                expand && 'h-[70vh] max-h-[70vh] overflow-auto',
              )}
            >
              {/* Agent/bot message  */}
              {/* <div>
                <div className="flex gap-4">
                  <div className="flex items-end">
                    <div className="flex min-h-[32px] min-w-[32px] items-center justify-center rounded-full bg-[#5A189A]">
                      <Image
                        src="/widget-logo.svg"
                        height={12}
                        width={12}
                        className="h-4 w-4"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="font-inter rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[2px] border border-[rgba(170,170,170,0.10)] bg-white px-2.5 py-2">
                    <p className="text-xs leading-[18px] font-normal text-black">
                      Hi there! Welcome to ChatBoq! What would you like to do
                      today?{' '}
                    </p>
                    <p className="mt-[5px] text-xs font-normal text-[#6D6D6D]">
                      03:33 PM
                    </p>
                  </div>
                </div>

                <div className="font-inter mt-2 ml-[48px] flex gap-2 text-xs">
                  <button className="flex cursor-pointer items-center rounded-lg border border-[#E2D4F7] bg-white p-2 text-[#8A53E1] hover:bg-[#E2D4F7]">
                    Chat with AI{' '}
                    <div className="ml-1">
                      {' '}
                      <StarIcon />
                    </div>
                  </button>
                  <button className="flex cursor-pointer items-center rounded-lg border border-[#E2D4F7] bg-white p-2 text-[#8A53E1] hover:bg-[#E2D4F7]">
                    Talk to Agent{' '}
                    <div className="ml-1">
                      <HeadCallIcon />
                    </div>
                  </button>
                </div>
              </div> */}

              {/* Date  */}
              <p className="font-inter mt-4 text-center text-xs font-normal">
                Thursday, July 10
              </p>

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
                <div className="mt-8 text-center text-gray-500">
                  No messages yet.
                </div>
              )}

              {/* Typing Indicator  */}
              {messages.map((msg: any, index: number) => (
                <MessageItem message={msg} key={msg?.id} socket={socket} />
              ))}
              {otherTyping && (
                <div className="mt-4 flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <span className="h-[6px] w-[6px] animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></span>
                    <span className="h-[6px] w-[6px] animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></span>
                    <span className="h-[6px] w-[6px] animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></span>
                    <span className="h-[6px] w-[6px] animate-bounce rounded-full bg-gray-400"></span>
                  </div>

                  <p className="text-xs font-normal text-[#1E1E1E]">
                    ChatBoq is typing....
                  </p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* <Input Section  */}
            <div className="font-inter border border-[rgba(170,170,170,0.10)] bg-white px-6 py-2 text-xs text-[#6D6D6D]">
              <form className="flex" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Compose your message"
                  className="font-inter flex-1 pr-2 focus:border-0 focus:ring-0 focus:outline-none"
                  value={message}
                  onChange={(e: any) => {
                    setMessage(e.target.value);

                    if (!socket || !isConnected) return;

                    // Debounce emitTyping (fires after 400ms of no input)
                    if (typingTimeoutRef.current)
                      clearTimeout(typingTimeoutRef.current);
                    if (e.target.value.trim()) {
                      setIsTyping(true);
                      typingTimeoutRef.current = setTimeout(() => {
                        emitTyping(e.target.value);
                      }, 200);
                    }

                    // Debounce emitStopTyping (fires after 1000ms of no input)
                    if (stopTypingTimeoutRef.current)
                      clearTimeout(stopTypingTimeoutRef.current);
                    if (e.target.value.trim()) {
                      stopTypingTimeoutRef.current = setTimeout(() => {
                        setIsTyping(false);
                        emitStopTyping();
                      }, 1000);
                    } else {
                      // If input is cleared, stop typing immediately
                      emitStopTyping();
                      setIsTyping(false);
                    }
                  }}
                  onBlur={() => {
                    emitStopTyping();
                  }}
                />
                <div className="flex items-center gap-[14px]">
                  <button>
                    <AttachmentIcon />
                  </button>
                  <button>
                    <MicIcon />
                  </button>

                  <button>
                    <EmojiIcon />
                  </button>

                  <button
                    disabled={!message.trim() || !isConnected}
                    type="submit"
                    className={cn(
                      `flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#8A53E1]`,
                      !message.trim() || (!isConnected && 'bg-[#E2D4F7]'),
                    )}
                  >
                    <SendIcon />
                  </button>
                </div>
              </form>
            </div>

            {/* Tab Section  */}
            <div className="px-6">
              <div className="flex justify-between py-2.5">
                <button className="btnHover flex cursor-pointer flex-col items-center justify-center hover:text-[#6D28D9]">
                  <HomeIcon />
                  <p className="font-inter text-xs leading-[18px] font-normal text-[#2C1057]">
                    Home
                  </p>
                </button>
                <button className="btnHover flex cursor-pointer flex-col items-center justify-center text-[#6D28D9]">
                  <RiMessage2Line />
                  {/* text-[#6D28D9] text-[#2C1057] */}
                  <p className="font-inter text-xs leading-[18px] font-normal text-[#6D28D9]">
                    Messages
                  </p>
                </button>
                <button className="btnHover flex cursor-pointer flex-col items-center justify-center hover:text-[#6D28D9]">
                  <InfoIcon />
                  <p className="font-inter text-xs leading-[18px] font-normal text-[#2C1057]">
                    Info Hub
                  </p>
                </button>
              </div>
              <p className="font-inter text-right text-xs font-normal text-[#6D6D6D]">
                {' '}
                Powered by <span className="text-[#6D28D9]">ChatBoq</span>{' '}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// const MessageItem = ({ socket, message }: any) => {
//   useEffect(() => {
//     if (!socket) return;
//     if (!!message?.user_id && !message?.seen) {
//       console.log('message seen', message);
//       socket.emit('message_seen', {
//         message_id: message?.id,
//       });
//     }
//   }, [message]);

//   return (
//     <div
//       className={`rounded p-3 break-words ${
//         !!message?.user_id
//           ? 'mr-auto self-start bg-gray-200 text-black'
//           : 'ml-auto self-end bg-blue-500 text-white'
//       } max-w-xs`}
//     >
//       {message?.content}
//     </div>
//   );
// };

const MessageItem = ({ socket, message }: any) => {
  useEffect(() => {
    if (!socket) return;
    if (!!message?.user_id && !message?.seen) {
      console.log('message seen', message);
      socket.emit('message_seen', {
        message_id: message?.id,
      });
    }
  }, [message]);

  return (
    <div>
      {!!message?.user_id ? (
        <>
          {/* Agent/Bot Message  */}
          <div className="mt-4 flex gap-4">
            <div className="flex items-end">
              <div className="flex min-h-[32px] min-w-[32px] items-center justify-center rounded-full bg-[#5A189A]">
                <Image
                  src="/widget-logo.svg"
                  height={12}
                  width={12}
                  className="h-4 w-4"
                  alt=""
                />
              </div>
            </div>
            <div className="font-inter rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[2px] border border-[rgba(170,170,170,0.10)] bg-white px-2.5 py-2">
              <p className="text-xs leading-[18px] font-normal text-black">
                {message?.content}
              </p>
              <p className="mt-[5px] text-xs font-normal text-[#6D6D6D]">
                {formatTime(message?.updated_at)}
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Customer message  */}
          <div className="mt-4 ml-auto w-fit rounded-tl-[12px] rounded-tr-[12px] rounded-br-[2px] rounded-bl-[12px] border border-[rgba(170,170,170,0.10)] bg-gradient-to-b from-[var(--Brand-500,#6D28D9)] to-[var(--Brand-300,#A77EE8)] p-2 text-xs text-white">
            <p> {message?.content}</p>
            <p>{formatTime(message?.updated_at)}</p>
          </div>
        </>
      )}
    </div>
  );
};
