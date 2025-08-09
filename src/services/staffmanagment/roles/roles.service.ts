import axiosInstance, { baseURL } from '@/apiConfigs/axiosInstance';

export class RolesService {
  // Create Organizations Role
  static async CreateRoles(payload: any) {
    try {
      const res = await axiosInstance.post(
        `${baseURL}/organizations/roles`,
        payload,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  // Get all  Permission groups
  static async GetAllPermissionGroup() {
    try {
      const res = await axiosInstance.get(
        `${baseURL}/staff-management/permission-groups`,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  // Get Get All Role Permission Group
  static async GetAllRolePermissionGroup() {
    try {
      const res = await axiosInstance.get(`${baseURL}/organizations/roles`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}
