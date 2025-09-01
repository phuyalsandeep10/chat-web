import axiosInstance, { baseURL } from '@/apiConfigs/axiosInstance';

export interface SendMessagePayload {
  ticket_id: number | string;
  receiver: string;
  content: string;
}

export const getTicketDetails = async (ticket_id: any) => {
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
};

export const postTicketDetails = async (payload: SendMessagePayload) => {
  try {
    const response = await axiosInstance.post('/tickets/conversation', payload);

    if (!response?.data) {
      throw new Error('Failed to post ticket details.');
    }

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Error posting ticket details',
    );
  }
};

export interface UpdateMessage {
  content: string;
  message_id: number;
}
export const updateTicketMessage = async (payload: UpdateMessage) => {
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
};
