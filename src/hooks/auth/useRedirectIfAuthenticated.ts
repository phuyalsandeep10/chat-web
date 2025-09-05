'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth/auth';
import { ROUTES } from '@/routes/routes';

export const useRedirectIfAuthenticated = () => {
  const router = useRouter();

  useEffect(() => {
    const tokens = AuthService.getAuthTokens();
    if (tokens) {
      router.replace(ROUTES.YOUR_INBOXES.MAIN_INBOX);
    }
  }, [router]);
};
