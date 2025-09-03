import axiosInstance from '@/apiConfigs/axiosInstance';
import { telegramPayload } from './types';

export class IntegrationService {
  static async getFacebookIntegrationUrl() {
    try {
      const response = await axiosInstance.get(`/facebook/auth/login`);
      if (!response?.data) {
        throw new Error(`Failed to fetch facebook login url`);
      }
      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getSlackIntegrationUrl() {
    try {
      const response = await axiosInstance.get(`/slack/auth/login`);
      if (!response?.data) {
        throw new Error(`Failed to fetch slack login url`);
      }
      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async postTelegramDetails(payload: telegramPayload) {
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
  }
}
