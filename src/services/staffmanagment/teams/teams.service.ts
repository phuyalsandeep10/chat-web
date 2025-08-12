import axiosInstance, { baseURL } from '@/apiConfigs/axiosInstance';

export class TeamsService {
  // Create Teams
  static async CreateTeams(payload: any) {
    try {
      const res = await axiosInstance.post(`${baseURL}/teams`, payload);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}
