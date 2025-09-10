import axiosInstance from '@/apiConfigs/axiosInstance';
import { GetVisitorsParams } from './types';

export class VisitorsService {
  //Get Online Visitors
  static async getOnlineVisitors() {
    try {
      const res = await axiosInstance.post(`/agent-chat/online-visitors`);

      return res.data;
    } catch (error) {
      throw error;
    }
  }

  //Get Visitors
  static async getVisitors({ statusFilters, sortBy }: GetVisitorsParams = {}) {
    try {
      const params: any = {};

      if (statusFilters && statusFilters.length > 0) {
        params.status_filters = statusFilters.join(',');
      }

      if (sortBy) {
        params.sort_by = sortBy;
      }

      const response = await axiosInstance.get(`/customers/visitors`, {
        params,
      });

      if (!response) {
        throw new Error('Failed to fetch visitor details');
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get Visitors Details by Id
  static async getVisitorsDetailsById(visitorId: number) {
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
  }

  //Get Visitirs By Country
  static async getVisitorsByCounty() {
    try {
      const response = await axiosInstance.get(
        `/agent-chat/visitors-by-country`,
      );

      if (!response) {
        throw new Error('Failed to fetch visitor details');
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  //Delete Visitors
  static async deleteVisitors(logId: number) {
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
  }
}
