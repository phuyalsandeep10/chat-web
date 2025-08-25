import axiosInstance, { baseURL } from '@/apiConfigs/axiosInstance';
import { createOrganizationPayload } from './types';
import { Country, CountriesApiResponse } from './types';

export class OrganizationsService {
  // Create Organizations
  static async createOrganizations(payload: createOrganizationPayload) {
    try {
      const res = await axiosInstance.post(`${baseURL}/organizations`, payload);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  // Update Organization
  static async updateOrganization(
    organization_id: string,
    payload: Partial<createOrganizationPayload>,
  ) {
    try {
      const res = await axiosInstance.put(
        `${baseURL}/organizations/${organization_id}`,
        payload,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  // Get Countries
  static async getCountries(): Promise<CountriesApiResponse> {
    try {
      const res = await axiosInstance.get<CountriesApiResponse>(
        `${baseURL}/organizations/countries`,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}
