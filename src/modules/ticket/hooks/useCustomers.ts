import axiosInstance from '@/apiConfigs/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useCustomers = (organizationId: number) => {
  return useQuery({
    queryKey: ['customers', organizationId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/tickets/customers`);
      console.log('Customers data:', data);
      return data.data;
    },
    enabled: !!organizationId,
  });
};
