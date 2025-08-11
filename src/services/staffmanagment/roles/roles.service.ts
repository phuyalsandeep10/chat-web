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

  //Edit Role
  static async UpdateRoles(role_id: string, payload: any) {
    try {
      console.log(role_id, payload);
      const res = await axiosInstance.put(
        `${baseURL}/staff-management/permission-groups?role_id=${14}`,
        payload,
      );
      console.log('UpdateRoles response:', res.data); // <-- Log response here
      return res.data;
    } catch (error) {
      console.error('UpdateRoles error:', error); // Also log errors if any
      throw error;
    }
  }

  // get existing data in role table
  static async getAllPermissionsForEdit(role_id) {
    console.log(role_id);
    try {
      console.log(role_id);
      const res = await axiosInstance.post(
        `${baseURL}/staff-management/permission-groups?role_id=${role_id}`,
      );
      console.log('UpdateRoles response:', res.data); // <-- Log response here
      return res.data;
    } catch (error) {
      console.error('UpdateRoles error:', error); // Also log errors if any
      throw error;
    }
  }

  //Delete Role
  static async DeleteRoles(role_id: string) {
    try {
      const res = await axiosInstance.delete(
        `${baseURL}/organizations/roles/${role_id}`,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}
