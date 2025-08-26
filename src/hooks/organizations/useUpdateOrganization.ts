import { OrganizationsService } from '@/services/organizations/organizations';
import { showToast } from '@/shared/toast';
import WorkspaceData from '@/store/WorkspaceStore/useWorkspaceStore';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useUpdateOrganization = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: Partial<WorkspaceData>) =>
      OrganizationsService.updateOrganization(data),
    onSuccess: (data) => {
      showToast({ title: data.message });
    },
    onError: (data) => {
      showToast({ title: data.message });
    },
  });
};
