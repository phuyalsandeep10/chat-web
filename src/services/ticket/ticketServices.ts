import axiosInstance, { baseURL } from '@/apiConfigs/axiosInstance';
import { SendMessagePayload, UpdateMessage } from './ticketTypes';

export class TicketService {
  //get ticket message
  static async getTicketDetails(ticket_id: string | number) {
    // console.log("lkdjsklfj", ticket_id)
    try {
      const response = await axiosInstance.get(`/tickets/${ticket_id}`);
      if (!response) {
        throw new Error('Failed to fetch ticket details');
      }
      const data = await response.data;
      return data;
    } catch (error) {
      throw error;
    }
  }
  //create ticket message/send message
  static async postTicketDetails(payload: SendMessagePayload) {
    try {
      const response = await axiosInstance.post(
        '/tickets/conversation',
        payload,
      );

      if (!response?.data) {
        throw new Error('Failed to post ticket details.');
      }

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error posting ticket details',
      );
    }
  }

  //update ticket message
  static async updateTicketMessage(payload: UpdateMessage) {
    try {
      const response = await axiosInstance.patch(
        `/tickets/conversation/${payload.message_id}`,
        { content: payload.content },
      );
      if (!response?.data) {
        throw new Error('Failed to update ticket message.');
      }

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error updating ticket message',
      );
    }
  }
}
