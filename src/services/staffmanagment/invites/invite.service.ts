import axiosInstance, { baseURL } from '@/apiConfigs/axiosInstance';

export class InviteService {
  // Invite member
  static async InviteMember() {
    try {
      const res = await axiosInstance.get(
        `${baseURL}/organizations/invitation`,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}
