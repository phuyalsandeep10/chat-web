import axiosInstance from '@/apiConfigs/axiosInstance';
import chatBoxAxiosInstance from '@/apiConfigs/chatBoxAxiosInstance';

export class CustomerConversationService {
  static async getCustomerAllChatConversationMessages(conversationId: number) {
    // identifier
    try {
      const res = await chatBoxAxiosInstance.get(
        `/customers/${conversationId}/messages`,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  static async initializeConversation(customerId: number, data: any) {
    try {
      const res = await chatBoxAxiosInstance.post(
        `/customers/${customerId}/initialize-conversation`,
        data,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  static async createCustomerConversationWithAgent(
    conversationId: number,
    data: any,
  ) {
    try {
      const res = await chatBoxAxiosInstance.post(
        `/customers/conversations/${conversationId}/messages`,
        data,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  static async createCustomer() {
    try {
      const res = await chatBoxAxiosInstance.post(`/customers/create`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  static async customerVisit(customerId: any) {
    try {
      const res = await chatBoxAxiosInstance.post(
        `/customers/${customerId}/visit`,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}
