import axiosInstance, { baseURL } from '@/apiConfigs/axiosInstance';

export const getConversation = async (
  ticket_id: any,
  limit: number = 10,
  before?: number,
) => {
  console.log('conversation', ticket_id, { limit, before });
  try {
    const params: any = { limit };
    if (before) {
      params.before = before;
    }

    const response = await axiosInstance.get(
      `/tickets/conversation/${ticket_id}`,
      { params },
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
