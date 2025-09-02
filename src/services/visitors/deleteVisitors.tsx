import axiosInstance from '@/apiConfigs/axiosInstance';

export const deleteVisitors = async (logId: number) => {
  try {
    const response = await axiosInstance.post(`/customers/delete-logs`, null, {
      params: { log_id: logId },
    });

    if (!response) {
      throw new Error("The log couldn't be deleted.");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};
