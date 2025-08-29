import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/apiConfigs/axiosInstance';
import { OrganizationResponse } from './types';

export const useGetorganizationDetails = () => {
  return useQuery<OrganizationResponse>({
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

export const useGetOrganizationById = (orgId: number) => {
  return useQuery<OrganizationResponse>({
    queryKey: ['getOrganizationById', orgId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/organizations/${orgId}`);
      return res.data.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};
