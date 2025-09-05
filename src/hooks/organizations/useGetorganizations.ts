import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/apiConfigs/axiosInstance';
import {
  Organization,
  OrganizationAPIResponse,
  OrganizationListResponse,
} from './types';
import { useWorkspaceInformationStore } from '@/store/WorkspaceInformation/useWorkspaceInformation';

export const useGetorganizationDetails = () => {
  return useQuery<OrganizationListResponse>({
    queryKey: ['getOrganizationDetails'],
    queryFn: async () => {
      const res = await axiosInstance.get('/organizations');
      if (res.data) {
        console.log(res.data);
      }
      return res.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

export const useGetOrganizationById = (options?: any) => {
  const { workspace, setWorkspace } = useWorkspaceInformationStore();
  return useQuery<OrganizationAPIResponse>({
    queryKey: ['getOrganizationById'],
    queryFn: async () => {
      const res = await axiosInstance.get(`/organizations/current`);
      setWorkspace(res.data.data);
      return res.data.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    ...options,
  });
};
