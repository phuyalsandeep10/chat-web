import axiosInstance, { baseURL } from '@/apiConfigs/axiosInstance';

export class RolesService {
  // Create Organizations Role
  static async CreateRoles(payload: any) {
    try {
      const res = await axiosInstance.post(
        `${baseURL}/organizations/roles`,
        payload,
      );
      console.log('crete role data', res);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  // Edit Organizations Role
  // static async EditRoles(payload: any) {
  //   try {
  //     const res = await axiosInstance.post(
  //       `${baseURL}/organizations/roles/{role_id}`,
  //       payload,
  //     );
  //     console.log('Edit role data', res);
  //     return res.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
