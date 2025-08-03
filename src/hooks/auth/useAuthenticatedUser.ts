import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/apiConfigs/axiosInstance';
import { AuthService } from '@/services/auth/auth';

interface User {
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      mobile: string | null;
      email_verified_at: string | null;
      is_staff: boolean;
      is_superuser: boolean;
      is_active: boolean;
      image: string | null;
      attributes: any | null;
      two_fa_secret: string;
      two_fa_auth_url: string;
      two_fa_enabled: boolean;
      is_2fa_verified: boolean;
      created_at: string;
      updated_at: string;
    };
    is_2fa_verified: boolean;
  };
  success: boolean;
  message: string;
}

export const useAuthenticatedUser = () => {
  const tokens = AuthService.getAuthTokens();

  return useQuery<User | null>({
    queryKey: ['authUser'],
    queryFn: async () => {
      if (!tokens?.accessToken) return null;
      const res = await axiosInstance.get('/auth/me');
      return res.data;
    },
    // refetchInterval:5000,
    // refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};
