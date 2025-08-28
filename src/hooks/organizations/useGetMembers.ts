import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/apiConfigs/axiosInstance';
import { OrganizationMember } from './types';

export const useGetMembers = (orgId: number, options?: any) => {
  return useQuery<OrganizationMember[]>({
    queryKey: ['getMembers', orgId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/organizations/${orgId}/members`);
      return res.data.data.map(
        (member: any) => member.user as OrganizationMember,
      );
    },
    enabled: !!orgId,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    ...options,
  });
};
