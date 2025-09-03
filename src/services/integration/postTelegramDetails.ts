import axiosInstance from '@/apiConfigs/axiosInstance';

export interface telegramPayload {
  token: string;
  display_name: string;
}

export const postTelegramDetails = async (payload: telegramPayload) => {
  try {
    const response = await axiosInstance.post(
      '/telegram/onboarding/connect',
      payload,
    );

    if (!response?.data) {
      throw new Error('Failed to post telegram details.');
    }

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Error posting telegram details.',
    );
  }
};
