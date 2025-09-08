import axiosInstance, { baseURL } from '@/apiConfigs/axiosInstance';

export class Operatorservice {
  // Invite member
  static async GetOpertaors() {
    try {
      const res = await axiosInstance.get(`${baseURL}/organizations/members`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  //Delete Role
  static async DeleteOperators(member_id: string) {
    try {
      const res = await axiosInstance.delete(
        `${baseURL}/organizations/member/${member_id}`,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  //Edit Operators
  static async EditOperators(member_id: string, payload: any) {
    try {
      const res = await axiosInstance.put(
        `${baseURL}/organizations/member/${member_id}`,
        payload,
      );
      return res.data;
    } catch (error) {
      console.error('UpdateRoles error:', error);
      throw error;
    }
  }
}
