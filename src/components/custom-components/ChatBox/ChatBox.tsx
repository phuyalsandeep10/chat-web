'use client';
import { baseURL } from '@/apiConfigs/axiosInstance';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CHAT_EVENTS } from '@/events/InboxEvents';
import { useAudio } from '@/hooks/useAudio.hook';
import { formatTime } from '@/lib/timeFormatUtils';
import { cn } from '@/lib/utils';
import { CustomerConversationService } from '@/services/inbox/customerConversation.service';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';
import { RiMessage2Line } from '@remixicon/react';
import EmojiPicker from 'emoji-picker-react';
import { Smile, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useChatBox } from './chatbox.provider';
import { HomeIcon, InfoIcon, MaximizeIcon, SendIcon } from './ChatBoxIcons';
import EmailInput from './EmailInput';
import WelcomeText from './WelcomeText';

interface Message {
  content: string;
  user_id?: number;
  organization_id?: number;
  conversation_id?: number;
  customer_id?: number;
  updated_at?: string;
  id?: number;
  seen?: boolean;
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
  const { visitor, setVisitor, error: visitVisitorError } = useChatBox();
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
  const messageBoxOpenRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [isOnline, setIsOnline] = useState(false);

  // Use refs for independent timeouts
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stopTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const emitTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // emojis
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const emojiBtnRef = useRef<HTMLDivElement>(null);

  const {
    messageNotificationCount,
    resetMessageNotificationCount,
    incrementMessageNotificationCount,
  } = useAgentConversationStore();

  const { playSound } = useAudio({ src: '/message.mp3' });

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
        if (!data?.user_id) return;
        setOtherTyping(false);
        console.log('Received message:', data);
        setMessages((prev) => [data, ...prev]);
        playSound();
        if (!messageBoxOpenRef.current) {
          console.log('hiii', isOpen);
          incrementMessageNotificationCount();
        }
      };

      // Set up event listeners
      newSocket.on('connect', handleConnect);
      newSocket.on('disconnect', handleDisconnect);
      newSocket.on('receive_message', handleMessage);
      newSocket.on('message_seen', (data) => console.log('message_seen', data));
      newSocket.on(CHAT_EVENTS.edit_message, (data) => {
        // console.log('Edited event Data', data);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === data.id
              ? { ...msg, content: data.content, updated_at: data.updated_at }
              : msg,
          ),
        );
      });
      newSocket.on('receive_typing', () => {
        console.log('typing...');
        setOtherTyping(true);
      });
      newSocket.on('stop_typing', () => {
        console.log('stop typing...');
        setOtherTyping(false);
      });
      newSocket.on(CHAT_EVENTS.agent_disconnected, (data) => {
        console.log('agent disconnected');
        console.log({ data });
        setIsOnline(false);
      });
      newSocket.on(CHAT_EVENTS.agent_connected, (data) => {
        console.log('agent connected', { data });
        setIsOnline(true);
      });

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

  const emitTyping = (message: string) => {
    if (!socket || !isConnected || !visitor?.conversation?.id) return;

    // Clear any existing timeout to prevent multiple rapid calls
    if (emitTypingTimeoutRef.current) {
      clearTimeout(emitTypingTimeoutRef.current);
    }

    // Set a new timeout for debouncing
    emitTypingTimeoutRef.current = setTimeout(() => {
      if (socket && isConnected && visitor?.conversation?.id) {
        socket.emit('typing', {
          mode: 'typing',
          conversation_id: visitor.conversation.id,
          organization_id: visitor.conversation.organization_id,
          message: message,
        });
      }
    }, 200); // 300ms debounce delay
  };

  const emitStopTyping = () => {
    //bug fix ==> faster enter causes the typing animation to load forever
    if (emitTypingTimeoutRef.current) {
      clearTimeout(emitTypingTimeoutRef.current);
    }

    if (!socket || !isConnected || !visitor?.conversation?.id) return;
    console.log('stop typing....');
    socket.emit('stop_typing', {
      conversation_id: visitor.conversation.id,
      organization_id: visitor.conversation.organization_id,
    });
  };

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
      return res;
    } catch (error) {
      console.error('Failed to initialize conversation:', error);
      throw error;
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

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      // Clear all timeouts when component unmounts
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (stopTypingTimeoutRef.current)
        clearTimeout(stopTypingTimeoutRef.current);
      if (emitTypingTimeoutRef.current)
        clearTimeout(emitTypingTimeoutRef.current);

      // Disconnect socket if it exists
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!socket || !message.trim()) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    emitStopTyping();

    try {
      if (!visitor?.conversation?.id) {
        await initializeConversation({
          customer_id: visitor?.customer?.id,
          organization_id: visitor?.customer?.organization_id,
          content: message,
        });
        return;
      }

      const res =
        await CustomerConversationService.createCustomerConversationWithAgent(
          visitor.conversation.id,
          { content: message },
        );

      setMessages((prev) => [res?.data, ...prev]);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const formatDateForGroup = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const groupedMessages = useMemo(() => {
    const reversed = [...messages].reverse();
    return reversed.reduce((acc: { [key: string]: Message[] }, msg) => {
      const dateKey = formatDateForGroup(msg.updated_at);
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(msg);
      return acc;
    }, {});
  }, [messages]);

  const sortedGroups = useMemo(() => {
    return Object.entries(groupedMessages).sort(([a], [b]) => {
      const normalize = (key: string) => {
        if (key === 'Today') return new Date().getTime();
        if (key === 'Yesterday') {
          const y = new Date();
          y.setDate(y.getDate() - 1);
          return y.getTime();
        }
        return new Date(key).getTime();
      };
      return normalize(a) - normalize(b);
    });
  }, [groupedMessages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setTimeout(() => {
        if (
          emojiRef.current &&
          !emojiRef.current.contains(event.target as Node) &&
          emojiBtnRef.current &&
          !emojiBtnRef.current.contains(event.target as Node)
        ) {
          setIsEmojiOpen(false);
        }
      }, 0);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node) &&
        emojiBtnRef.current &&
        !emojiBtnRef.current.contains(event.target as Node)
      ) {
        setIsEmojiOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const autoResize = (textarea: any) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  return (
    <>
      <div className="fixed right-4 bottom-4 z-50">
        {/* Floating button */}
        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true);
              messageBoxOpenRef.current = true;
              resetMessageNotificationCount();
            }}
            className="relative flex min-h-[42px] min-w-[42px] cursor-pointer items-center justify-center rounded-full bg-[#5A189A] shadow-lg transition hover:bg-[#5A189A]"
          >
            <Image
              src="/widget-logo.svg"
              height={24}
              width={20}
              className="h-6 w-6"
              alt="chatboq bot logo"
            />
            {messageNotificationCount > 0 && (
              <span className="bg-error absolute top-[-5px] right-[0px] flex h-4 w-4 animate-bounce items-center justify-center rounded-full text-[10px] text-white">
                {messageNotificationCount}
              </span>
            )}
          </button>
        )}
        {isOpen && (
          <div
            className={cn(
              `w-[360px] overflow-hidden rounded-xl bg-[#FAFAFA]`,
              expand &&
                'h-[calc(100vh-20px)] w-[calc(100vw-100px)] transition-all',
            )}
          >
            <div className="flex items-center justify-between bg-gradient-to-b from-[#6D28D9] to-[#A77EE8] px-2 py-2">
              <div className="left flex items-center">
                <div className="flex items-center justify-center rounded-full">
                  <Image
                    src="/widget-logo-bottom.svg"
                    height={20}
                    width={20}
                    className="h-full w-full"
                    alt=""
                  />
                </div>
                <div className="">
                  <h3 className="font-sans text-[20px] leading-6 font-medium text-white">
                    ChatBoq
                  </h3>
                  {isOnline && (
                    <p className="font-inter text-[11px] leading-[16.5px] font-normal text-white">
                      Online
                    </p>
                  )}
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
                  onClick={() => {
                    setIsOpen(false);
                    messageBoxOpenRef.current = false;
                    resetMessageNotificationCount();
                  }}
                  className="cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {visitVisitorError && (
              <div className="absolute z-50 flex min-h-[50vh] w-full flex-col items-center justify-center space-y-4 bg-white/80 text-center text-3xl font-semibold text-red-500 backdrop-blur-sm">
                <p>No Access</p>
                <p className="text-2xl font-semibold">
                  Visit our site:{' '}
                  <a href="http://dev.chatboq.com" target="_blank">
                    <span className="underline">chatboq.com</span>
                  </a>
                </p>
              </div>
            )}
            <div className="relative">
              <div
                className={cn(
                  `max-h-[50vh] min-h-[50vh] overflow-auto px-6 py-4 pb-[80px]`,
                  expand && 'h-[70vh] max-h-[70vh] overflow-auto',
                )}
              >
                <WelcomeText />
                {/* email input here */}

                <EmailInput />

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
                {error && (
                  <div className="text-center text-red-500">{error}</div>
                )}
                {!loading && !error && messages.length === 0 && (
                  <div className="mt-8 text-center text-gray-500">
                    No messages yet.
                  </div>
                )}

                {sortedGroups.map(([dateLabel, msgs]) => (
                  <div key={dateLabel}>
                    {/* Date Divider */}
                    <p className="font-inter mt-4 text-center text-xs font-normal">
                      {dateLabel}
                    </p>

                    {/* Messages for this date */}
                    {msgs.map((msg) => (
                      <MessageItem
                        message={msg}
                        key={msg?.id}
                        socket={socket}
                        organization_id={visitor?.conversation?.organization_id}
                      />
                    ))}
                  </div>
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
              <div className="font-inter absolute right-0 bottom-0 left-0 border border-[rgba(170,170,170,0.10)] bg-white px-6 py-2 text-xs text-[#6D6D6D]">
                <form
                  className="flex items-start justify-between"
                  onSubmit={handleSubmit}
                >
                  <textarea
                    ref={textareaRef}
                    placeholder="Compose your message "
                    className="font-inter max-h-[120px] min-h-[20px] w-[calc(80%)] flex-1 resize-none overflow-y-auto pt-3 pr-2 focus:border-0 focus:ring-0 focus:outline-none"
                    value={message}
                    rows={1}
                    onChange={(e: any) => {
                      setMessage(e.target.value);

                      // Auto-resize textarea
                      autoResize(e.target);

                      if (!socket || !isConnected) return;

                      if (e.target.value.trim()) {
                        setIsTyping(true);
                      }
                      emitTyping(e.target.value.trim());
                    }}
                    onKeyDown={(e: any) => {
                      if (e.key === 'Enter') {
                        if (e.shiftKey) {
                          // Shift + Enter: Allow new line (default behavior)
                          return;
                        } else {
                          // Enter only: Submit form
                          e.preventDefault();
                          if (message.trim() && isConnected) {
                            handleSubmit(e);
                          }
                        }
                      }
                    }}
                    onBlur={() => {
                      emitStopTyping();
                    }}
                  />
                  <div className="flex items-center gap-[14px]">
                    {/* <button>
                    <AttachmentIcon />
                  </button>
                  <button>
                    <MicIcon />
                  </button> */}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div ref={emojiBtnRef}>
                          <Smile />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="mr-5 p-0" side="top">
                        <EmojiPicker
                          onEmojiClick={(emojiData) => {
                            setMessage((prev) => prev + emojiData.emoji);
                          }}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>

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

const MessageItem = ({ socket, message, organization_id }: any) => {
  useEffect(() => {
    if (!socket) return;
    if (!!message?.user_id && !message?.seen) {
      console.log('message seen', message);
      socket.emit('message_seen', {
        message_id: message?.id,
        organization_id: organization_id,
      });
    }
  }, [message, socket, organization_id]);

  console.log(message);
  return (
    <div>
      {!!message?.user_id ? (
        <>
          {/* Agent/Bot Message  */}
          <div className="mt-4 flex gap-2">
            <div className="flex items-end">
              <Avatar className="h-8 w-8">
                {message?.user && message?.user?.image ? (
                  <AvatarImage src={message?.user?.image} alt="bot icon" />
                ) : (
                  <AvatarFallback className="text-brand-dark text-xs font-medium">
                    {message?.user?.name?.substring(0, 2)?.toLocaleUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>

            <div className="font-inter space-y-2 rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[2px] border border-[rgba(170,170,170,0.10)] bg-white px-2.5 py-2">
              {message?.reply_to && message?.reply_to_id && (
                <div className="relative rounded-lg border-l-[2px] border-l-[#6D28D9] bg-[#F6F2FF] p-2">
                  <h3 className="font-inter text-xs leading-[18px] font-normal text-[#16082B]">
                    Replied
                  </h3>

                  <div
                    className="font-inter mt-2 min-w-[100px] text-[11px] font-normal text-black"
                    dangerouslySetInnerHTML={{
                      __html: message?.reply_to?.content,
                    }}
                  />
                </div>
              )}

              <div
                dangerouslySetInnerHTML={{
                  __html: message?.content,
                }}
                className="text-xs leading-[18px] font-normal break-all text-black [&_ol]:list-decimal [&_ol]:pl-2 [&_ul]:list-disc [&_ul]:pl-2"
              />

              <p className="mt-[5px] text-xs font-normal text-[#6D6D6D]">
                {formatTime(message?.updated_at)}
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Customer message  */}
          <div className="mt-4 ml-auto w-fit rounded-tl-[12px] rounded-tr-[12px] rounded-br-[2px] rounded-bl-[12px] border border-[rgba(170,170,170,0.10)] bg-gradient-to-b from-[#6D28D9] to-[#A77EE8] p-2 text-xs text-white">
            <p className="break-all"> {message?.content}</p>
            <p>{formatTime(message?.updated_at)}</p>
          </div>
        </>
      )}
    </div>
  );
};
