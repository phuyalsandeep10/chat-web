import axiosInstance from '@/apiConfigs/axiosInstance';

export const getFacebookIntegrationUrl = async () => {
  try {
    const response = await axiosInstance.get(`/facebook/auth/login`);
    if (!response) {
      throw new Error('Failed to fetch facebook login url');
    }
    const data = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const getSlackIntegrationUrl = async () => {
  try {
    const response = await axiosInstance.get(`/slack/auth/login`);
    if (!response) {
      throw new Error('Failed to fetch slack login url');
    }
    const data = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};
