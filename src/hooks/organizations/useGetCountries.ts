import { OrganizationsService } from '@/services/organizations/organizations';
import { useQuery } from '@tanstack/react-query';

export const useGetCountries = () => {
  return useQuery({
    queryKey: ['getCountries'],
    queryFn: () => OrganizationsService.getCountries(),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};
