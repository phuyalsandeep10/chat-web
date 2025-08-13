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

  // Invite  Teams
  static async InviteTeams(payload: any) {
    try {
      const res = await axiosInstance.post(
        `${baseURL}/organizations/invitation`,
        payload,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  // get Teams
  static async GetTeams() {
    try {
      const res = await axiosInstance.get(`${baseURL}/teams`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  //Delete Teams
  static async DeleteTeams(team_id: string) {
    // deleting teams
    try {
      const res = await axiosInstance.delete(`${baseURL}/teams/${team_id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}
