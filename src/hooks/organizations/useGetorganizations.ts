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

export const useGetOrganizationById = (orgId: number, options?: any) => {
  const { workspace, setWorkspace } = useWorkspaceInformationStore();
  return useQuery<OrganizationAPIResponse>({
    queryKey: ['getOrganizationById', orgId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/organizations/current`);
      console.log('Api Response: ', res.data.data.organization);
      setWorkspace(res.data.data.organization);
      console.log(res.data.data);
      return res.data.data;
    },

    enabled: !!orgId,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    ...options,
  });
};
