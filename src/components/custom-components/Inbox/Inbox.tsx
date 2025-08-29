'use client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSocket } from '@/context/socket.context';
import { useMessageAudio } from '@/hooks/useMessageAudio.hook';
import { useUiStore } from '@/store/UiStore/useUiStore';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import SubSidebarContentWrapper from '../CustomSidebar/SubSidebarContentWrapper';
import ChatEmptyScreen from './ChatEmptyScreen/ChatEmptyScreen';
import InboxChatInfo from './InboxChatInfo/InboxChatInfo';
import InboxChatSection from './InboxChatSection/InboxChatSection';
import InboxSubSidebar from './InboxSidebar/InboxSubSidebar';

import { ConversationService } from '@/services/inbox/agentCoversation.service';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';

const Inbox = () => {
  const params = useParams();
  const chatId = params?.userId;
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [typingmessage, setTypingMessage] = useState<string>('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [message, setMessage] = useState('');

  const { showChatInfo } = useUiStore();
  const { socket } = useSocket();
  const { playSound } = useMessageAudio();
  const { authData } = useAuthStore();

  const {
    messages,
    setConversationData,
    sendMessageToDB,
    addMessageToStore,
    updateMessageSeen,
    fetchMessages,
    joinConversation,
    req_loading,
  } = useAgentConversationStore();

  const userId = authData?.data?.user?.id;

  useEffect(() => {
    if (!chatId || !socket || !userId) return;

    fetchMessages(Number(chatId));

    const getAgentChatConversastionDetails = async () => {
      const data: any = await ConversationService.getConversationDetailsById(
        Number(chatId),
      );
      setConversationData(data);
    };

    joinConversation(Number(chatId));

    getAgentChatConversastionDetails();

    socket.emit('join_conversation', {
      conversation_id: chatId,
      user_id: userId,
    });

    // socket.emit('joinChat', chatId);
    socket.on('receive-message', (data) => {
      console.log('Message received:', data);
      const isSenderMessage = data?.user_id === userId;

      if (!isSenderMessage) {
        addMessageToStore(data);
        playSound();
      } else {
      }
    });
    socket.on('typing', (data) => {
      console.log('typing ...', data);
      setShowTyping(true);
      setTypingMessage(data?.message);
    });
    socket.on('message_seen', (data) => {
      updateMessageSeen(data?.message_id);
    });
    socket.on('stop-typing', () => {
      console.log('Stopping...');
      setTimeout(() => {
        setShowTyping(false);
      }, 2000);
    });

    return () => {
      socket.emit('leave_conversation', { conversation_id: 1 });
    };
  }, [chatId, socket, playSound, userId, setConversationData]);

  const onSend = async (e: any) => {
    e.preventDefault();
    const text = inputRef.current?.value;
    if (!socket) return;
    if (text) {
      // typing: stop on send
      // socket.emit('stop-typing');
      setIsTyping(false);
      if (typingTimeout) {
        clearTimeout(typingTimeout);
        setTypingTimeout(null);
      }

      emitStopTyping();

      await sendMessageToDB(
        Number(chatId),
        message.trim(),
        replyingTo ? replyingTo?.id : null,
      );

      setMessage('');
      if (inputRef.current) inputRef.current.value = '';
      setReplyingTo(null);
    }
  };

  const handleReply = (replyToMessage: string) => {
    setReplyingTo(replyToMessage);
  };

  const clearReply = () => {
    setReplyingTo(null);
  };

  const emitTyping = (message: string) => {
    if (!socket) return;
    socket.emit('typing', {
      message,
      mode: 'typing',
      conversation_id: Number(chatId),
      organization_id: authData?.data?.user?.attributes?.organization_id,
    });
    console.log('Hello typing....', isTyping);
  };
  const emitStopTyping = () => {
    if (!socket) return;
    socket.emit('stop_typing', { conversation_id: Number(chatId) });
  };

  return (
    <div className="flex">
      <SubSidebarContentWrapper className="w-[306px]">
        <div className="flex-1">
          <InboxSubSidebar />
        </div>
      </SubSidebarContentWrapper>

      {chatId ? (
        <>
          <div className="flex-1">
            <InboxChatSection messages={messages} onReply={handleReply} />
            <div className="relative m-4">
              <div>
                {showTyping && (
                  <p className="text-red-300">Typing...{typingmessage}</p>
                )}
              </div>
              <div className="relative">
                {replyingTo && (
                  <div className="bg bg-brand-disable absolute top-2 right-2 left-2 z-10 flex w-fit items-center justify-between rounded-md border px-4 py-2 text-black">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-black">Replying to:</span>
                      <span className="text-theme-text-primary max-w-[200px] truncate text-xs font-medium">
                        {replyingTo?.content}
                      </span>
                    </div>
                    <button
                      onClick={clearReply}
                      className="text-theme-text-primary hover:text-brand-dark ml-2 text-sm"
                    >
                      ×
                    </button>
                  </div>
                )}

                <Textarea
                  placeholder="Enter your message here"
                  className={` ${replyingTo ? 'pt-14' : 'pt-3'}`}
                  ref={inputRef as any}
                  value={message}
                  onChange={(e: any) => {
                    setMessage(e.target.value);
                    if (!socket) return;

                    if (!isTyping) {
                      setIsTyping(true);

                      // socket.emit('message', { message, mode: 'typing' });
                      emitTyping(e.target.value);
                    }

                    if (typingTimeout) clearTimeout(typingTimeout);

                    const timeout = setTimeout(() => {
                      setIsTyping(false);
                      // socket.emit('message', { message, mode: 'stop-typing' });
                      emitStopTyping();
                    }, 2000);

                    setTypingTimeout(timeout);
                  }}
                  onKeyDown={(e: any) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onSend(e);
                    }
                  }}
                />
              </div>

              <div className="mt-3 flex justify-end">
                <Button type="button" onClick={onSend}>
                  {'Send'}
                </Button>
              </div>
            </div>
          </div>
          {showChatInfo && (
            <div className="w-[400px]">
              <InboxChatInfo />
            </div>
          )}
        </>
      ) : (
        <ChatEmptyScreen />
      )}
    </div>
  );
};

export default Inbox;
