import { create } from 'zustand';
import { ConversationService } from '@/services/inbox/agentCoversation.service';
import { ConversationResponse, ConversationState } from './types';
import axiosInstance from '@/apiConfigs/axiosInstance';

export const useAgentConversationStore = create<ConversationState>((set) => ({
  conversation: null,
  customer: null,
  messages: [],
  all_conversations: [],
  visitorCount:
    typeof window !== 'undefined'
      ? Number(localStorage.getItem('visitorCount') || 0)
      : 0,
  messageNotificationCount:
    typeof window !== 'undefined'
      ? Number(localStorage.getItem('messageNotificationCount') || 0)
      : 0,
  req_loading: {
    fetch_messages: false,
    add_message: false,
    fetch_conversation: false,
    resolve_conversation: false,
    fetch_all_conversations: false,
  },
  req_success: {
    fetch_messages: false,
    add_message: false,
    fetch_conversation: false,
    resolve_conversation: false,
    fetch_all_conversations: false,
  },
  setConversationData: (data: ConversationResponse) =>
    set({
      conversation: data.data.conversation,
      customer: data.data.customer,
    }),
  setMessages: (messages) => set({ messages }),
  addMessageToStore: (message) =>
    set((state) => {
      const updatedConversations = state.all_conversations.map((conv) =>
        conv.id === message.conversation_id
          ? {
              ...conv,
              attributes: {
                ...conv.attributes,
                last_message: {
                  id: message.id,
                  content: message.content,
                  created_at: message.created_at,
                  updated_at: message.updated_at,
                  conversation_id: message.conversation_id,
                  seen: message.seen,
                  user_id: message.user_id,
                  customer_id: message.customer_id,
                  reply_to_id: message.reply_to_id,
                  active: message.active,
                  created_by_id: message.created_by_id,
                  updated_by_id: message.updated_by_id,
                  feedback: message.feedback,
                  deleted_at: message.deleted_at,
                },
              },
            }
          : conv,
      );
      console.log(updatedConversations);
      return {
        messages: [...state.messages, message],
        all_conversations: updatedConversations,
      };
    }),
  updateMessageSeen: (messageId) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, seen: true } : m,
      ),
    })),
  setLoading: (key, value) =>
    set((state) => ({
      req_loading: { ...state.req_loading, [key]: value },
    })),
  setSuccess: (key, value) =>
    set((state) => ({
      req_success: { ...state.req_success, [key]: value },
    })),
  fetchMessages: async (chatId: number) => {
    set({
      req_loading: {
        fetch_messages: true,
        add_message: false,
        fetch_conversation: false,
        fetch_all_conversations: false,
        resolve_conversation: false,
      },
    });
    try {
      const data = await ConversationService.getAllMessagesById(chatId);
      set({
        messages: data?.data,
        req_success: {
          fetch_messages: true,
          add_message: false,
          fetch_conversation: false,
          fetch_all_conversations: false,
          resolve_conversation: false,
        },
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      set({
        req_success: {
          fetch_messages: false,
          add_message: false,
          fetch_conversation: false,
          fetch_all_conversations: false,
          resolve_conversation: false,
        },
      });
    } finally {
      set({
        req_loading: {
          fetch_messages: false,
          add_message: false,
          fetch_conversation: false,
          fetch_all_conversations: false,
          resolve_conversation: false,
        },
      });
    }
  },
  sendMessageToDB: async (
    chatId: number,
    content: string,
    replyToId: number | null = null,
  ) => {
    set({
      req_loading: {
        fetch_messages: false,
        add_message: true,
        fetch_conversation: false,
        fetch_all_conversations: false,
        resolve_conversation: false,
      },
    });
    try {
      const response = await ConversationService.createMessage(chatId, {
        content,
        reply_to_id: replyToId,
      });
      set((state) => {
        const updatedConversations = state.all_conversations.map((conv) =>
          conv.id === chatId
            ? {
                ...conv,
                attributes: {
                  ...conv.attributes,
                  last_message: {
                    id: response.data.id,
                    content: response.data.content,
                    created_at: response.data.created_at,
                    updated_at: response.data.updated_at,
                    conversation_id: response.data.conversation_id,
                    seen: response.data.seen,
                    user_id: response.data.user_id,
                    customer_id: response.data.customer_id,
                    reply_to_id: response.data.reply_to_id,
                    active: response.data.active,
                    created_by_id: response.data.created_by_id,
                    updated_by_id: response.data.updated_by_id,
                    feedback: response.data.feedback,
                    deleted_at: response.data.deleted_at,
                  },
                },
              }
            : conv,
        );
        return {
          messages: [...state.messages, response?.data],
          all_conversations: updatedConversations,
          req_success: {
            fetch_messages: false,
            add_message: true,
            fetch_conversation: false,
            fetch_all_conversations: false,
            resolve_conversation: false,
          },
        };
      });
    } catch (error) {
      console.error('Error sending message:', error);
      set({
        req_success: {
          fetch_messages: false,
          add_message: false,
          fetch_conversation: false,
          fetch_all_conversations: false,
          resolve_conversation: false,
        },
      });
    } finally {
      set({
        req_loading: {
          fetch_messages: false,
          add_message: false,
          fetch_conversation: false,
          fetch_all_conversations: false,
          resolve_conversation: false,
        },
      });
    }
  },
  fetchConversationDetails: async (chatId: number) => {
    set({
      req_loading: {
        fetch_messages: false,
        add_message: false,
        fetch_conversation: true,
        fetch_all_conversations: false,
        resolve_conversation: false,
      },
    });
    try {
      const data: ConversationResponse =
        await ConversationService.getConversationDetailsById(chatId);
      set({
        conversation: data.data.conversation,
        customer: data.data.customer,
        req_success: {
          fetch_messages: false,
          add_message: false,
          fetch_conversation: true,
          fetch_all_conversations: false,
          resolve_conversation: false,
        },
      });
    } catch (error) {
      console.error('Error fetching conversation details:', error);
      set({
        req_success: {
          fetch_messages: false,
          add_message: false,
          fetch_conversation: false,
          fetch_all_conversations: false,
          resolve_conversation: false,
        },
      });
    } finally {
      set({
        req_loading: {
          fetch_messages: false,
          add_message: false,
          fetch_conversation: false,
          fetch_all_conversations: false,
          resolve_conversation: false,
        },
      });
    }
  },
  resolveConversation: async (chatId: number) => {
    set({
      req_loading: {
        fetch_messages: false,
        add_message: false,
        fetch_conversation: false,
        fetch_all_conversations: false,
        resolve_conversation: true,
      },
    });
    try {
      const response = await ConversationService.resolvedConversation(chatId);
      // console.log('Resolve response:', response);
      set({
        conversation: response.data,
        req_success: {
          fetch_messages: false,
          add_message: false,
          fetch_conversation: false,
          fetch_all_conversations: false,
          resolve_conversation: true,
        },
      });
      const res = await ConversationService.getAllChatConversations();
      // console.log('Fetched all conversations after resolve:', res);
      set({
        all_conversations: [...res?.data],
        req_success: {
          fetch_messages: false,
          add_message: false,
          fetch_conversation: false,
          fetch_all_conversations: true,
          resolve_conversation: true,
        },
      });
    } catch (error) {
      console.error('Error resolving conversation:', error);
      set({
        req_success: {
          fetch_messages: false,
          add_message: false,
          fetch_conversation: false,
          fetch_all_conversations: false,
          resolve_conversation: false,
        },
      });
    } finally {
      set({
        req_loading: {
          fetch_messages: false,
          add_message: false,
          fetch_conversation: false,
          fetch_all_conversations: false,
          resolve_conversation: false,
        },
      });
    }
  },
  joinConversation: async (conversationId: number) => {
    try {
      await axiosInstance.put(
        `/agent-chat/conversations/${conversationId}/joined`,
      );
      const res = await ConversationService.getAllChatConversations();
      // console.log('Conversations:', res);
      set({
        all_conversations: [...res?.data],
      });
    } catch (error) {
      console.error('Error joining conversation:', error);
    }
  },

  fetchAllConversations: async () => {
    set({
      req_loading: {
        fetch_messages: false,
        add_message: false,
        fetch_conversation: false,
        resolve_conversation: false,
        fetch_all_conversations: true,
      },
    });
    try {
      const res = await ConversationService.getAllChatConversations();
      // console.log('Fetched all conversations:', res);
      set({
        all_conversations: [...res?.data],
        req_success: {
          fetch_messages: false,
          add_message: false,
          fetch_conversation: false,
          resolve_conversation: false,
          fetch_all_conversations: true,
        },
      });
    } catch (error) {
      console.error('Error fetching all conversations:', error);
      set({
        req_success: {
          fetch_messages: false,
          add_message: false,
          fetch_conversation: false,
          resolve_conversation: false,
          fetch_all_conversations: false,
        },
      });
    } finally {
      set({
        req_loading: {
          fetch_messages: false,
          add_message: false,
          fetch_conversation: false,
          resolve_conversation: false,
          fetch_all_conversations: false,
        },
      });
    }
  },

  incrementVisitorCount: () => {
    set((state) => {
      const newCount = state.visitorCount + 1;
      if (typeof window !== 'undefined') {
        localStorage.setItem('visitorCount', String(newCount));
      }
      return { visitorCount: newCount };
    });
  },
  resetVisitorCount: () => {
    set(() => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('visitorCount');
      }
      return { visitorCount: 0 };
    });
  },

  incrementMessageNotificationCount: () => {
    set((state) => {
      const newCount = state.messageNotificationCount + 1;
      if (typeof window !== 'undefined') {
        localStorage.setItem('messageNotificationCount', String(newCount));
      }
      return { messageNotificationCount: newCount };
    });
  },
  resetMessageNotificationCount: () => {
    set(() => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('messageNotificationCount');
      }
      return { messageNotificationCount: 0 };
    });
  },
}));
