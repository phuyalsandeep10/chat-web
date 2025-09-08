import axiosInstance from '@/apiConfigs/axiosInstance';

export const deleteVisitors = async (logId: number) => {
  try {
    console.log(logId);
    const response = await axiosInstance.delete(`/customers/${logId}`);

    if (!response) {
      throw new Error("The log couldn't be deleted.");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};
