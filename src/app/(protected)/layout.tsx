'use client';

import CustomSidebar from '@/components/custom-components/CustomSidebar/CustomSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SocketProvider } from '@/context/socket.context';
import { useAuthenticatedUser } from '@/hooks/auth/useAuthenticatedUser';
import { ROUTES } from '@/routes/routes';
import { AuthService } from '@/services/auth/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: authData, isLoading } = useAuthenticatedUser();
  const router = useRouter();
  const authTokens = AuthService.getAuthTokens();

  useEffect(() => {
    if (!authTokens) {
      router.replace(ROUTES.LOGIN);
    }
    if (!isLoading) {
      const user = authData?.data?.user;
      if (!user) {
        router.replace(ROUTES.LOGIN);
      }
    }
  }, [authData, isLoading, router, authTokens]);

  if (isLoading || !authData)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div>Loading...</div>
      </div>
    );

  return (
    <SidebarProvider>
      <CustomSidebar />
      <SocketProvider>
        {/* <SidebarTrigger /> */}
        <div className="w-full">{children}</div>
      </SocketProvider>
    </SidebarProvider>
  );
}
