import axiosInstance from '@/apiConfigs/axiosInstance';
import { showToast } from '@/shared/toast';
import { useMutation } from '@tanstack/react-query';
import { OwnershipInvitationPayload } from './types';

export const useSendOwnershipInvitation = () => {
  return useMutation({
    mutationFn: async (payload: OwnershipInvitationPayload) => {
      const res = await axiosInstance.put(
        `/organizations/change-owner`,
        payload,
      );
      return res.data;
    },
    onSuccess: (data) => {
      showToast({ title: 'Invitation Sent Successfully', variant: 'success' });
    },
    onError: (data) => {
      showToast({ title: 'Failed to send invitation', variant: 'error' });
    },
  });
};
