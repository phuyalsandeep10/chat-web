import axiosInstance from '@/apiConfigs/axiosInstance';
import { showToast } from '@/shared/toast';
import { useMutation } from '@tanstack/react-query';

const useDeleteOrganization = () => {
  return useMutation({
    mutationFn: async (identifier: string) => {
      const response = await axiosInstance.post(
        '/organizations/delete-workspace',
        {
          identifier,
        },
      );
      return response.data;
    },
    onSuccess: (data) => {
      showToast({
        title: 'Workspace deleted successfully!',
        variant: 'success',
      });
    },
    onError: (error) => {
      showToast({ title: 'Error deleting workspace', variant: 'error' });
    },
  });
};

export default useDeleteOrganization;
