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
import { CHAT_EVENTS } from '@/events/InboxEvents';

const Inbox = () => {
  const params: any = useParams();
  const chatId = params?.userId;
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [editedMessage, setEditedMessage] = useState<any>({});
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
    editMessage,
    joinConversation,
  } = useAgentConversationStore();

  const userId = authData?.data?.user?.id;

  // 🔹 Define event handlers once
  const handleReceiveMessage = (data: any) => {
    const isSenderMessage = data?.user_id === userId;
    console.log('Message received:', data);
    if (!isSenderMessage) {
      addMessageToStore(data);
      playSound();
    }
  };

  const handleTyping = (data: any) => {
    console.log('typing ...', data);
    setShowTyping(true);
    setTypingMessage(data?.message);
  };

  const handleStopTyping = () => {
    console.log('Stopping...');
    setTimeout(() => {
      setShowTyping(false);
    }, 2000);
  };

  const handleMessageSeen = (data: any) => {
    console.log('message seen', data);
    updateMessageSeen(data?.message_id);
  };

  // 🔹 Common cleanup function
  const cleanupSocketListeners = () => {
    if (!socket) return;
    socket.off(CHAT_EVENTS.receive_message, handleReceiveMessage);
    socket.off(CHAT_EVENTS.receive_typing, handleTyping);
    socket.off(CHAT_EVENTS.message_seen, handleMessageSeen);
    socket.off(CHAT_EVENTS.stop_typing, handleStopTyping);
  };

  useEffect(() => {
    if (!chatId || !socket || !userId) return;

    fetchMessages(Number(chatId));

    const getAgentChatConversationDetails = async () => {
      const data: any = await ConversationService.getConversationDetailsById(
        Number(chatId),
      );
      setConversationData(data);
    };

    joinConversation(Number(chatId));
    getAgentChatConversationDetails();

    // socket.emit('join_conversation', {
    //   conversation_id: chatId,
    //   user_id: userId,
    // });

    // Attach listeners
    socket.on(CHAT_EVENTS.receive_message, handleReceiveMessage);
    socket.on(CHAT_EVENTS.receive_typing, handleTyping);
    socket.on(CHAT_EVENTS.message_seen, handleMessageSeen);
    socket.on(CHAT_EVENTS.stop_typing, handleStopTyping);

    return () => {
      cleanupSocketListeners();
      socket.emit(CHAT_EVENTS.leave_conversation);
    };
  }, [chatId, socket, userId, playSound]);

  // ---- SEND MESSAGE ----
  const onSend = async (e: any) => {
    e.preventDefault();
    const text = inputRef.current?.value;
    if (!socket || !text) return;

    setIsTyping(false);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }

    emitStopTyping();

    if (editedMessage && editedMessage.id) {
      await editMessage(editedMessage.id, text);
      setEditedMessage(null);
    } else {
      await sendMessageToDB(Number(chatId), text, replyingTo?.id || null);
    }
    setMessage('');
    if (inputRef.current) inputRef.current.value = '';
    setReplyingTo(null);
  };

  // ---- REPLY HELPERS ----
  const handleReply = (replyToMessage: string) => {
    setReplyingTo(replyToMessage);
    setEditedMessage({});
  };
  const handleEditMessage = (messageToEdit: any) => {
    setEditedMessage(messageToEdit);
    setMessage(messageToEdit?.content);
    setReplyingTo(null);
  };
  const clearReply = () => setReplyingTo(null);

  // ---- TYPING HELPERS ----
  const emitTyping = (message: string) => {
    if (!socket) return;
    socket.emit('typing', {
      message,
      mode: 'typing',
      conversation_id: Number(chatId),
      organization_id: authData?.data?.user?.attributes?.organization_id,
    });
  };

  const emitStopTyping = () => {
    if (!socket) return;
    socket.emit(CHAT_EVENTS.stop_typing, {
      conversation_id: Number(chatId),
    });
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
            <InboxChatSection
              messages={messages}
              onReply={handleReply}
              handleEditMessage={handleEditMessage}
              showTyping
              typingmessage={typingmessage}
            />

            <div className="relative m-4">
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
                  className={replyingTo ? 'pt-14' : 'pt-3'}
                  ref={inputRef as any}
                  value={message}
                  onChange={(e: any) => {
                    setMessage(e.target.value);
                    if (!socket) return;

                    if (!isTyping && e.target.value.trim()) {
                      setIsTyping(true);
                      emitTyping(e.target.value);
                    }

                    if (typingTimeout) clearTimeout(typingTimeout);

                    const timeout = setTimeout(() => {
                      setIsTyping(false);
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
                  Send
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
      {/* <button onClick={() => editMessage()}>Edit message</button> */}
    </div>
  );
};

export default Inbox;
