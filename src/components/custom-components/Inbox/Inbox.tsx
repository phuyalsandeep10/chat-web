'use client';
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
  const [typingmessage, setTypingMessage] = useState<string>('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const editorRef = useRef<any>(null);
  const [message, setMessage] = useState<string | null>(null);

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
    customer,
    conversation,
    members,
  } = useAgentConversationStore();
  const params: any = useParams();
  const chatId = params?.userId;

  console.log('members', members);

  const userId = authData?.data?.user?.id;

  // 🔹 Define event handlers once
  const handleReceiveMessage = (data: any) => {
    const isSenderMessage = data?.user_id === userId;
    setTypingMessage('');
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
      setTypingMessage('');
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
  const onSend = async (editorInstance?: any) => {
    // Get the latest content from the editor if available
    const latestMessage = editorInstance?.getHTML?.();
    console.log({ latestMessage, socket });

    if (!latestMessage) return;

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
    editorRef.current.onClear();
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

  const emitStopTyping = async () => {
    if (!socket) return;
    await socket.emit(CHAT_EVENTS.stop_typing, {
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

                <Editor
                  value={message}
                  ref={editorRef}
                  onSubmit={onSend}
                  onChange={(value) => {
                    console.log(value);
                    setMessage(value);
                    // console.log('message here', message);
                    if (!socket) return;
                    console.log(value);

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
                  }}
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
      {/* <button onClick={() => editMessage()}>Edit message</button> */}
    </div>
  );
};

export default Inbox;
