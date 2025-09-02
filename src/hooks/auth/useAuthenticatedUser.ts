import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/apiConfigs/axiosInstance';
import { AuthService } from '@/services/auth/auth';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';

export interface User {
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      mobile: string | undefined;
      language: string;
      email_verified_at: string | null;
      is_staff: boolean;
      is_superuser: boolean;
      is_active: boolean;
      image: string | undefined | null;
      attributes: any | null;
      two_fa_secret: string;
      two_fa_auth_url: string;
      two_fa_enabled: boolean;
      is_2fa_verified: boolean;
      country?: string;
      address?: string;
      created_at: string;
      updated_at: string;
      phone_code?: string;
    };
    is_2fa_verified: boolean;
  };
  success: boolean;
  message: string;
}

export const useAuthenticatedUser = () => {
  const tokens = AuthService.getAuthTokens();
  const setAuthData = useAuthStore((state) => state.setAuthData);

  return useQuery<User | null>({
    queryKey: ['authUser'],
    queryFn: async () => {
      if (!tokens?.accessToken) return null;
      const res = await axiosInstance.get('/auth/me');
      if (res.data) {
        setAuthData(res.data);
      }
      return res.data;
    },
    // refetchInterval:5000,
    // refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};
