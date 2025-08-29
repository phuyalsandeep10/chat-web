import axiosInstance, { baseURL } from '@/apiConfigs/axiosInstance';

export const getConversation = async (ticket_id: any) => {
  console.log('conversation', ticket_id);
  try {
    const response = await axiosInstance.get(
      `/tickets/conversation/${ticket_id}`,
      {
        params: {
          limit: 50,
        },
      },
    );

    if (!response?.data?.success) {
      throw new Error('Failed to fetch conversation details');
    }

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.success === false) {
      throw new Error(
        error.response.data.message || 'Error fetching conversation',
      );
    }
    throw error;
  }
};
