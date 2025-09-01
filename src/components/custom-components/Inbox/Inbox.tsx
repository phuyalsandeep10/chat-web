'use client';
import { useSocket } from '@/context/socket.context';
import { useMessageAudio } from '@/hooks/useMessageAudio.hook';
import { useUiStore } from '@/store/UiStore/useUiStore';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import SubSidebarContentWrapper from '../CustomSidebar/SubSidebarContentWrapper';
import ChatEmptyScreen from './ChatEmptyScreen/ChatEmptyScreen';
import InboxChatInfo from './InboxChatInfo/InboxChatInfo';
import InboxChatSection from './InboxChatSection/InboxChatSection';
import InboxSubSidebar from './InboxSidebar/InboxSubSidebar';
import { CHAT_EVENTS } from '@/events/InboxEvents';
import { ConversationService } from '@/services/inbox/agentCoversation.service';
import Editor from '@/shared/Editor/Editor';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';

const Inbox = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [editedMessage, setEditedMessage] = useState<any>({});
  const [isTyping, setIsTyping] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState<string>('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const editorRef = useRef<any>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

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
  const params: any = useParams();
  const chatId = params?.userId;
  const userId = authData?.data?.user?.id;

  // 🔹 Define event handlers
  const handleReceiveMessage = useCallback(
    (data: any) => {
      const isSenderMessage = data?.user_id === userId;
      setTypingMessage('');
      setShowTyping(false); // Reset typing when a message is received
      if (!isSenderMessage) {
        addMessageToStore(data);
        playSound();
      }
    },
    [userId, addMessageToStore, playSound],
  );

  const handleTyping = useCallback((data: any) => {
    console.log('typing ... server emit the receive event', data);
    setShowTyping(true);
    setTypingMessage(data?.message || '');
  }, []);

  const handleStopTyping = useCallback(() => {
    console.log('Stopping...');
    setShowTyping(false);
    setTypingMessage('');
  }, []);

  const handleMessageSeen = useCallback(
    (data: any) => {
      console.log('message seen', data);
      updateMessageSeen(data?.message_id);
    },
    [updateMessageSeen],
  );

  // 🔹 Common cleanup function
  const cleanupSocketListeners = useCallback(() => {
    if (!socket) return;
    socket.off(CHAT_EVENTS.receive_message, handleReceiveMessage);
    socket.off(CHAT_EVENTS.receive_typing, handleTyping);
    socket.off(CHAT_EVENTS.message_seen, handleMessageSeen);
    socket.off(CHAT_EVENTS.stop_typing, handleStopTyping);
    socket.emit(CHAT_EVENTS.leave_conversation, {
      conversation_id: Number(chatId),
    });
  }, [
    socket,
    handleReceiveMessage,
    handleTyping,
    handleMessageSeen,
    handleStopTyping,
    chatId,
  ]);

  // 🔹 Reset typing state and cleanup on chatId change
  useEffect(() => {
    if (!chatId || !socket || !userId) return;

    // Reset states when chatId changes
    setShowTyping(false);
    setTypingMessage('');
    setIsTyping(false);
    setMessage(null);
    setReplyingTo(null);
    setEditedMessage({});
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }

    // Fetch messages and conversation details
    fetchMessages(Number(chatId));
    const getAgentChatConversationDetails = async () => {
      const data: any = await ConversationService.getConversationDetailsById(
        Number(chatId),
      );
      setConversationData(data);
    };

    joinConversation(Number(chatId));
    getAgentChatConversationDetails();

    // Attach listeners
    socket.on(CHAT_EVENTS.receive_message, handleReceiveMessage);
    socket.on(CHAT_EVENTS.receive_typing, handleTyping);
    socket.on(CHAT_EVENTS.message_seen, handleMessageSeen);
    socket.on(CHAT_EVENTS.stop_typing, handleStopTyping);

    return () => {
      cleanupSocketListeners();
    };
  }, [
    chatId,
    socket,
    userId,
    handleReceiveMessage,
    handleTyping,
    handleMessageSeen,
    handleStopTyping,
    cleanupSocketListeners,
    fetchMessages,
    joinConversation,
    setConversationData,
  ]);

  // 🔹 Typing helpers
  const emitTyping = useCallback(
    (message: string) => {
      if (!socket || isSending || !chatId) return;
      socket.emit('typing', {
        message,
        mode: 'typing',
        conversation_id: Number(chatId),
        organization_id: authData?.data?.user?.attributes?.organization_id,
      });
    },
    [socket, chatId, authData, isSending],
  );

  const emitStopTyping = useCallback(async () => {
    if (!socket || !chatId) return;
    await socket.emit(CHAT_EVENTS.stop_typing, {
      conversation_id: Number(chatId),
    });
  }, [socket, chatId]);

  const onSend = useCallback(
    async (editorInstance?: any) => {
      const latestMessage = editorInstance?.getHTML?.();
      if (!latestMessage || latestMessage === '<p></p>') return;

      setIsSending(true);
      setIsTyping(false);
      if (typingTimeout) {
        clearTimeout(typingTimeout);
        setTypingTimeout(null);
      }

      await emitStopTyping();

      if (editedMessage && editedMessage.id) {
        await editMessage(editedMessage.id, latestMessage);
        setEditedMessage(null);
      } else {
        await sendMessageToDB(
          Number(chatId),
          latestMessage,
          replyingTo?.id || null,
        );
      }

      setMessage(null);
      editorRef.current?.onClear();
      if (inputRef.current) inputRef.current.value = '';
      setReplyingTo(null);
      setIsSending(false);
    },
    [
      chatId,
      editedMessage,
      replyingTo,
      sendMessageToDB,
      editMessage,
      emitStopTyping,
      typingTimeout,
    ],
  );

  const handleReply = useCallback((replyToMessage: any) => {
    setReplyingTo(replyToMessage);
    setEditedMessage({});
  }, []);

  const handleEditMessage = useCallback((messageToEdit: any) => {
    setEditedMessage(messageToEdit);
    setMessage(messageToEdit?.content);
    setReplyingTo(null);
  }, []);

  const clearReply = useCallback(() => setReplyingTo(null), []);

  const handleEditorChange = useCallback(
    (value: string) => {
      if (isSending) return;
      setMessage(value);

      if (!socket || !chatId) return;

      if (!isTyping) {
        setIsTyping(true);
        emitTyping(value);
      }

      if (typingTimeout) clearTimeout(typingTimeout);

      const timeout = setTimeout(() => {
        setIsTyping(false);
        emitStopTyping();
      }, 500);

      setTypingTimeout(timeout);
    },
    [
      socket,
      isTyping,
      typingTimeout,
      emitTyping,
      emitStopTyping,
      isSending,
      chatId,
    ],
  );

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
              showTyping={showTyping}
              typingmessage={typingMessage}
            />
            {replyingTo && (
              <div className="bg bg-brand-disable relative -top-12 left-4 z-30 flex w-fit items-center justify-between rounded-md border px-4 py-2 text-black">
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
            <div className="relative m-4">
              <div className="relative">
                <Editor
                  value={message}
                  ref={editorRef}
                  onSubmit={onSend}
                  onChange={handleEditorChange}
                />
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
