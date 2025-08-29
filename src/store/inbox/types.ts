export interface Customer {
  id: number;
  name: string;
  created_at: string;
  organization_id: number;
  phone: string;
  updated_at: string;
  email: string;
  active: boolean;
  attributes: Record<string, any> | null;
  created_by_id: number | null;
  ip_address: string;
  updated_by_id: number | null;
  is_online: boolean;
  deleted_at: string | null;
}

export interface Conversation {
  id: number;
  active: boolean;
  updated_by_id: number | null;
  name: string | null;
  customer_id: number;
  is_resolved: boolean;
  created_at: string;
  updated_at: string;
  created_by_id: number | null;
  deleted_at: string | null;
  organization_id: number;
  attributes: Record<string, any>;
}

export interface ConversationResponse {
  success: boolean;
  message: string;
  data: {
    conversation: Conversation;
    customer: Customer;
  };
}

export interface Message {
  id: number;
  content: string;
  conversation_id: number;
  created_at: string;
  updated_at: string;
  seen: boolean;
  active: boolean;
  created_by_id: number | null;
  customer_id: number | null;
  deleted_at: string | null;
  feedback: any | null;
  messageId: number | null;
  reply_to_id: number | null;
  updated_by_id: number | null;
  user_id: number | null;
}

export interface ConversationState {
  conversation: Conversation | null;
  customer: Customer | null;
  messages: Message[];
  all_conversations: any[];
  visitorCount: number;
  messageNotificationCount: number;
  req_loading: {
    fetch_messages: boolean;
    add_message: boolean;
    fetch_conversation: boolean;
    resolve_conversation: boolean;
    fetch_all_conversations: boolean;
  };
  req_success: {
    fetch_messages: boolean;
    add_message: boolean;
    fetch_conversation: boolean;
    resolve_conversation: boolean;
    fetch_all_conversations: boolean;
  };
  setConversationData: (data: ConversationResponse) => void;
  setMessages: (messages: Message[]) => void;
  addMessageToStore: (message: Message) => void;
  updateMessageSeen: (messageId: number) => void;
  setLoading: (key: string, value: boolean) => void;
  setSuccess: (key: string, value: boolean) => void;
  fetchMessages: (chatId: number) => Promise<void>;
  sendMessageToDB: (
    chatId: number,
    content: string,
    replyToId: number | null,
  ) => Promise<void>;
  fetchConversationDetails: (chatId: number) => Promise<void>;
  resolveConversation: (chatId: number) => Promise<void>;
  joinConversation: (conversationId: number) => Promise<void>;
  fetchAllConversations: () => Promise<void>;
  incrementVisitorCount: () => void;
  resetVisitorCount: () => void;
  incrementMessageNotificationCount: () => void;
  resetMessageNotificationCount: () => void;
}
