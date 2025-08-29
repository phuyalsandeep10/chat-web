import { ROUTES } from '@/routes/routes';
import { AuthService } from '@/services/auth/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: AuthService.logoutUser,
    onSuccess: (data) => {
      // AuthService.clearAuthTokens();
      // router.replace(ROUTES.LOGIN);
      toast.success(data?.message || 'Logged out successfully');
    },
    onError: (error: any) => {
      // toast.error(error?.response?.data?.message || 'Logout failed');
      console.error('Logout failed:', error);
    },
  });
};
