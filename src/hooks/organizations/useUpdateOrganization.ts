import { OrganizationsService } from '@/services/organizations/organizations';
import { showToast } from '@/shared/toast';
import { useWorkspaceInformationStore } from '@/store/WorkspaceInformation/useWorkspaceInformation';
import WorkspaceData from '@/store/WorkspaceStore/useWorkspaceStore';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useUpdateOrganization = () => {
  const router = useRouter();
  const { updateWorkspace } = useWorkspaceInformationStore();
  return useMutation({
    mutationFn: (data: Partial<WorkspaceData>) =>
      OrganizationsService.updateOrganization(data),
    onSuccess: (data) => {
      showToast({
        title: 'Workspace Updated Successfully',
        variant: 'success',
      });
      updateWorkspace(data.data.workspace);
    },
    onError: (data) => {
      showToast({ title: 'Failed to update workspace', variant: 'error' });
    },
  });
};
