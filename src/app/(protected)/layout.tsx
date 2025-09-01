'use client';

import CustomSidebar from '@/components/custom-components/CustomSidebar/CustomSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SocketProvider } from '@/context/socket.context';
import { useTickectSlaSocket } from '@/context/ticketsla.context';
import { useAuthenticatedUser } from '@/hooks/auth/useAuthenticatedUser';
import { ROUTES } from '@/routes/routes';
import { AuthService } from '@/services/auth/auth';
import TicketSLABreachDialog from '@/shared/TicketSLABreachDialog';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [openTicketSLABeachDialog, setOpenTicketBreachDialog] = useState(false);
  const { data: authData, isLoading } = useAuthenticatedUser();
  const router = useRouter();
  const authTokens = AuthService.getAuthTokens();
  const { socket: TicketSlaSocket } = useTickectSlaSocket();
  const [slaData, setSlaData] = useState<any | null>(null);
  // const [slaData, setSlaData] = useState<any | null>({
  //   message: '100% of the response time has elapsed',
  //   level: 75,
  //   payload: {
  //     id: 2,
  //     title: 'Demo not working',
  //     description: 'test_ticket_description',
  //   },
  // });

  const showTicketSlaAlert = (data: any) => {
    console.log('showTicketSlaAlert data', data);
    setSlaData(data);
    setOpenTicketBreachDialog(true);
  };

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

  //  useEffect(() => {
  //     TicketSlaSocket?.on('ticket_sla_alert', showTicketSlaAlert);
  //     return () => {
  //       TicketSlaSocket?.off('ticket_sla_alert', showTicketSlaAlert);
  //     };
  //   }, [TicketSlaSocket]);

  if (isLoading || !authData)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  TicketSlaSocket?.on('ticket_sla_alert', showTicketSlaAlert);

  return (
    <SidebarProvider>
      <CustomSidebar />
      <SocketProvider>
        <>
          {/* <SidebarTrigger /> */}
          <div className="w-full">{children}</div>
          <TicketSLABreachDialog
            data={slaData}
            open={openTicketSLABeachDialog}
            setOpen={setOpenTicketBreachDialog}
          />
        </>
      </SocketProvider>
    </SidebarProvider>
  );
}
