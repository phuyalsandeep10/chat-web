import axiosInstance from '@/apiConfigs/axiosInstance';

export class ConversationService {
  static async getAllChatConversations() {
    try {
      const res = await axiosInstance.get('/agent-chat/conversations');
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  static async getConversationDetailsById(conversationsId: number) {
    try {
      const res = await axiosInstance.get(
        `/agent-chat/conversations/${conversationsId}`,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  static async getAllMessagesById(conversationsId: number) {
    try {
      const res = await axiosInstance.get(
        `/agent-chat/conversations/${conversationsId}/messages`,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  static async createMessage(conversationsId: number, data: any) {
    try {
      const res = await axiosInstance.post(
        `/agent-chat/conversations/${conversationsId}/messages`,
        data,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  static async editMessage(messageId: number, data: any) {
    try {
      const res = await axiosInstance.put(
        `/agent-chat/messages/${messageId}`,
        data,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  static async resolvedConversation(conversationId: number) {
    try {
      const res = await axiosInstance.put(
        `/agent-chat/conversations/${conversationId}/resolved`,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}
