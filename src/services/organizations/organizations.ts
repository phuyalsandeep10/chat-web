import axiosInstance, { baseURL } from '@/apiConfigs/axiosInstance';
import { createOrganizationPayload, TimeZonesApiResponse } from './types';
import { Country, CountriesApiResponse } from './types';
import WorkspaceData from '@/store/WorkspaceStore/useWorkspaceStore';

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
  static async updateOrganization(payload: Partial<WorkspaceData>) {
    try {
      const res = await axiosInstance.post(
        `${baseURL}/organizations/update-workspace`,
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

  //Get Time Zones
  static async getTimeZones(): Promise<TimeZonesApiResponse> {
    try {
      const res = await axiosInstance.get<TimeZonesApiResponse>(
        `${baseURL}/organizations/timezones`,
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}
