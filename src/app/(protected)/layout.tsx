'use client';

import CustomSidebar from '@/components/custom-components/CustomSidebar/CustomSidebar';
import BusinessCreateFormModal from '@/components/custom-components/Dashboard/BusinessCreateFormModal/BusinessCreateFormModal';
import VerifyEmailModal from '@/components/custom-components/Dashboard/VerifyEmailModal/VerifyEmailModal';
import AuthenticatorModal from '@/components/modal/Authenticator/AuthenticatorModal';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SocketProvider } from '@/context/socket.context';
import { useTickectSlaSocket } from '@/context/ticketsla.context';
import { useAuthenticatedUser } from '@/hooks/auth/useAuthenticatedUser';
import { useMessageAudio } from '@/hooks/useMessageAudio.hook';
import { ROUTES } from '@/routes/routes';
import { AuthService } from '@/services/auth/auth';
import TicketSLABreachDialog from '@/shared/TicketSLABreachDialog';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [openTicketSLABeachDialog, setOpenTicketBreachDialog] = useState(false);
  const [open2FaAuthenticatorModal, setOpen2FaAuthenticatorModal] =
    useState(false);
  const [openEmailVerifyForm, setOpenVerifyEmail] = useState(false);
  const [openCreateBusinessModal, setOpenCreateBusinessModal] = useState(false);

  const authenticatedUserDataFromStore = useAuthStore(
    (state) => state.authData,
  );

  const { data: authData, isLoading } = useAuthenticatedUser();
  const router = useRouter();
  const authTokens = AuthService.getAuthTokens();
  const { socket: TicketSlaSocket } = useTickectSlaSocket();
  const [slaData, setSlaData] = useState<any | null>(null);
  const { playSound } = useMessageAudio();

  const showTicketSlaAlert = (data: any) => {
    setSlaData(data);
    setOpenTicketBreachDialog(true);
    playSound();
  };

  useEffect(() => {
    if (isLoading) return;

    if (!authTokens) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    if (authData && !authData.data?.user) {
      router.replace(ROUTES.LOGIN);
    }
  }, [authData, isLoading, router, authTokens]);

  useEffect(() => {
    if (!authenticatedUserDataFromStore?.data?.user?.email_verified_at) {
      setOpenVerifyEmail(true);
    } else {
      setOpenVerifyEmail(false);
    }

    if (
      Object.keys(authenticatedUserDataFromStore?.data?.user?.attributes || {})
        .length === 0 &&
      authenticatedUserDataFromStore?.data?.user?.email_verified_at
    ) {
      setOpenCreateBusinessModal(true);
    } else {
      setOpenCreateBusinessModal(false);
    }

    if (
      authenticatedUserDataFromStore?.data?.user?.two_fa_enabled &&
      !authenticatedUserDataFromStore?.data?.is_2fa_verified
    ) {
      setOpen2FaAuthenticatorModal(true);
    } else {
      setOpen2FaAuthenticatorModal(false);
    }
  }, [authenticatedUserDataFromStore]);

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
          <AuthenticatorModal
            open={open2FaAuthenticatorModal}
            setOpen={setOpen2FaAuthenticatorModal}
            otpauth_url={authData?.data?.user?.two_fa_auth_url || ''}
            cancelButtonText="Cancel"
            submitButtonText="Submit"
            submitPendingText="Submitting..."
            from="dashboard"
          />

          <VerifyEmailModal
            open={openEmailVerifyForm}
            setOpen={setOpenVerifyEmail}
          />
          <BusinessCreateFormModal
            open={openCreateBusinessModal}
            setOpen={setOpenCreateBusinessModal}
          />
        </>
      </SocketProvider>
    </SidebarProvider>
  );
}
