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

  //Delete Role
  static async DeleteInvites(invitation_id: string) {
    try {
      const res = await axiosInstance.delete(
        `${baseURL}/organizations/invitations/${invitation_id}`,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}
