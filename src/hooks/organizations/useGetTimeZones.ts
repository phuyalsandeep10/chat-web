import { OrganizationsService } from '@/services/organizations/organizations';
import { useQuery } from '@tanstack/react-query';

export const useGetTimeZones = () => {
  return useQuery({
    queryKey: ['getTimeZones'],
    queryFn: () => OrganizationsService.getTimeZones(),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};
