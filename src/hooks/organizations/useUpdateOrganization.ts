import { OrganizationsService } from '@/services/organizations/organizations';
import { createOrganizationPayload } from '@/services/organizations/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useUpdateOrganization = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: ({
      organization_id,
      payload,
    }: {
      organization_id: string;
      payload: Partial<createOrganizationPayload>;
    }) => OrganizationsService.updateOrganization(organization_id, payload),
  });
};
