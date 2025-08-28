import axiosInstance from '@/apiConfigs/axiosInstance';

export class CustomerConversationService {
  static async getCustomerAllChatConversationMessages(conversationId: number) {
    // identifier
    try {
      const res = await axiosInstance.get(
        `/customers/${conversationId}/messages`,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  static async initializeConversation(customerId: number, data: any) {
    try {
      const res = await axiosInstance.post(
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
      const res = await axiosInstance.post(
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
      const res = await axiosInstance.post(`/customers`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  static async customerVisit(customerId: any) {
    try {
      const res = await axiosInstance.post(`/customers/${customerId}/visit`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}
