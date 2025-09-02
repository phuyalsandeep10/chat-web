import axiosInstance from '@/apiConfigs/axiosInstance';

interface GetVisitorsParams {
  statusFilters?: string[];
  sortBy?: string;
}

export const getVisitors = async ({
  statusFilters,
  sortBy,
}: GetVisitorsParams = {}) => {
  try {
    const params: any = {};

    if (statusFilters && statusFilters.length > 0) {
      params.status_filters = statusFilters.join(',');
    }

    if (sortBy) {
      params.sort_by = sortBy;
    }

    const response = await axiosInstance.get(`/customers/visitors`, { params });

    if (!response) {
      throw new Error('Failed to fetch visitor details');
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVisitorsDetails = async (visitorId: any) => {
  try {
    const response = await axiosInstance.get(`/customers/visitor`, {
      params: { customer_id: visitorId },
    });

    if (!response) {
      throw new Error("The Visitor Details couldn't be fetched.");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};
