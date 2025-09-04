import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/apiConfigs/axiosInstance';
import { OrganizationMember } from './types';

export const useGetMembers = (options?: any) => {
  return useQuery<OrganizationMember[]>({
    queryKey: ['getMembers'],
    queryFn: async () => {
      const res = await axiosInstance.get(`/organizations/members`);
      return res.data.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    ...options,
  });
};
