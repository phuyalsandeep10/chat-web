'use client';
import { useSocket } from '@/context/socket.context';
import { CHAT_EVENTS } from '@/events/InboxEvents';
import { useMessageAudio } from '@/hooks/useMessageAudio.hook';
import { ConversationService } from '@/services/inbox/agentCoversation.service';
import Editor from '@/shared/Editor/Editor';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';
import { useUiStore } from '@/store/UiStore/useUiStore';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import SubSidebarContentWrapper from '../CustomSidebar/SubSidebarContentWrapper';
import ChatEmptyScreen from './ChatEmptyScreen/ChatEmptyScreen';
import InboxChatInfo from './InboxChatInfo/InboxChatInfo';
import InboxChatSection from './InboxChatSection/InboxChatSection';
import InboxSubSidebar from './InboxSidebar/InboxSubSidebar';

const Inbox = () => {
  const editorRef = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [editedMessage, setEditedMessage] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
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
    updateConversationLastMessage,
    updateCustomerDetails,
  } = useAgentConversationStore();
  const params: any = useParams();
  const chatId = params?.userId;
  const userId = authData?.data?.user?.id;

  const handleReceiveMessage = (data: any) => {
    const isSenderMessage = data?.user_id === userId;

    if (data?.conversation_id !== Number(chatId)) {
      updateConversationLastMessage(data);
      return;
    }
    setTypingMessage('');
    setShowTyping(false);
    if (!isSenderMessage) {
      addMessageToStore(data);
      playSound();
    }
  };

  const handleTyping = (data: any) => {
    if (data?.conversation_id !== Number(chatId)) return;
    if (!data?.is_customer) return;
    setShowTyping(true);

    setTypingMessage(data?.message || '');
  };

  const handleStopTyping = (data: any) => {
    if (data?.conversation_id !== Number(chatId)) return;
    setShowTyping(false);
    setTypingMessage('');
  };

  const handleMessageSeen = (data: any) => {
    updateMessageSeen(data?.message_id);
  };

  const updatEmail = (data: any) => {
    updateCustomerDetails(data?.customer);
  };

  const cleanupSocketListeners = () => {
    if (!socket) return;
    socket.off(CHAT_EVENTS.receive_message, handleReceiveMessage);
    socket.off(CHAT_EVENTS.receive_typing, handleTyping);
    socket.off(CHAT_EVENTS.message_seen, handleMessageSeen);
    socket.off(CHAT_EVENTS.stop_typing, handleStopTyping);
    // socket.emit(CHAT_EVENTS.leave_conversation, {
    //   conversation_id: Number(chatId),
    // });
  };

  useEffect(() => {
    if (!socket || !userId) return;

    // Fetch data
    fetchMessages(Number(chatId));
    const getAgentChatConversationDetails = async () => {
      const data: any = await ConversationService.getConversationDetailsById(
        Number(chatId),
      );
      setConversationData(data);
    };

    joinConversation(Number(chatId));
    getAgentChatConversationDetails();

    // Attach socket listeners
    socket.on(CHAT_EVENTS.receive_message, handleReceiveMessage);
    socket.on(CHAT_EVENTS.receive_typing, handleTyping);
    socket.on(CHAT_EVENTS.message_seen, handleMessageSeen);
    socket.on(CHAT_EVENTS.stop_typing, handleStopTyping);
    socket.on(CHAT_EVENTS.customer_email_update, updatEmail);

    return () => cleanupSocketListeners();
  }, [socket, userId]);

  useEffect(() => {
    if (!chatId) return;

    const savedDraft = localStorage.getItem(`draft-${chatId}`);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);

        if (parsedDraft.message) {
          setMessage(parsedDraft.message);
          editorRef.current?.commands?.setContent(parsedDraft.message);
        }

        if (parsedDraft.replyingTo) {
          setReplyingTo(parsedDraft.replyingTo);
        }
      } catch (err) {
        console.error('Failed to parse draft:', err);
      }
    }
  }, [chatId]);

  // Save draft when message changes
  useEffect(() => {
    if (!chatId) return;

    if (message || replyingTo) {
      const draft = {
        message,
        replyingTo,
      };
      localStorage.setItem(`draft-${chatId}`, JSON.stringify(draft));
    } else {
      localStorage.removeItem(`draft-${chatId}`);
    }
  }, [message, replyingTo, chatId]);

  const emitTyping = (msg: string) => {
    if (!socket || isSending || !chatId) return;
    socket.emit('typing', {
      message: msg,
      mode: 'typing',
      conversation_id: Number(chatId),
      organization_id: authData?.data?.user?.attributes?.organization_id,
    });
  };

  const emitStopTyping = () => {
    if (!socket || !chatId) return;
    socket.emit(CHAT_EVENTS.stop_typing, {
      conversation_id: Number(chatId),
    });
  };

  const onSend = async (editorInstance?: any) => {
    const latestMessage = editorInstance?.getHTML?.();
    console.log({ editedMessage, replyingTo });

    if (!latestMessage || latestMessage === '<p></p>') {
      console.warn('Empty message, not sending');
      return;
    }

    setIsSending(true);
    setIsTyping(false);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    emitStopTyping();

    try {
      if (editedMessage?.id) {
        await editMessage(editedMessage.id, latestMessage);
        setEditedMessage(null);
      } else {
        await sendMessageToDB(Number(chatId), latestMessage, replyingTo?.id);
        setReplyingTo(null);
      }
      setMessage(null);
      localStorage.removeItem(`draft-${chatId}`);
      editorRef.current?.onClear();
    } catch (error) {
    } finally {
      setIsSending(false);
    }
  };
  const debounceFocus = () => {
    if (editorRef.current) {
      setTimeout(() => {
        editorRef.current.focus();
      }, 500);
    }
  };

  const handleReply = (replyToMessage: any) => {
    if (!replyToMessage || !replyToMessage.id || !replyToMessage.content) {
      return;
    }
    setReplyingTo({ ...replyToMessage });
    setEditedMessage(null);
    debounceFocus();
  };

  const handleEditMessage = (messageToEdit: any) => {
    if (!messageToEdit || !messageToEdit.id || !messageToEdit.content) {
      return;
    }

    setEditedMessage(messageToEdit);
    setMessage(messageToEdit.content);
    setReplyingTo(null);

    if (editorRef.current) {
      editorRef?.current?.commands?.setContent(messageToEdit.content);
      debounceFocus();
    }
  };

  const clearReply = () => setReplyingTo(null);

  const handleEditorChange = (value: string) => {
    if (isSending) return;
    setMessage(value);

    if (!socket || !chatId) return;

    if (!isTyping) {
      setIsTyping(true);
      emitTyping(value);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      emitStopTyping();
    }, 1000);
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
          <div className="border-gray-light flex-1 border-r">
            <InboxChatSection
              messages={messages}
              onReply={handleReply}
              handleEditMessage={handleEditMessage}
              showTyping={showTyping}
              typingmessage={typingMessage}
              replyingTo={replyingTo}
            />
            {replyingTo && (
              <div className="bg bg-brand-disable relative ml-4 flex w-fit items-center justify-between rounded-md border px-4 py-2 text-black">
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
            <div className="relative m-4 mt-2">
              <Editor
                value={message}
                ref={editorRef}
                onSubmit={onSend}
                onChange={handleEditorChange}
              />
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
