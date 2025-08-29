'use client';

import React, { useEffect, useState } from 'react';
import AuthenticatorModal from '@/components/modal/Authenticator/AuthenticatorModal';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import VerifyEmailModal from '@/components/custom-components/Dashboard/VerifyEmailModal/VerifyEmailModal';
import BusinessCreateFormModal from '@/components/custom-components/Dashboard/BusinessCreateFormModal/BusinessCreateFormModal';
import { useTickectSlaSocket } from '@/context/ticketsla.context';
import TicketSLABreachDialog from '@/shared/TicketSLABreachDialog';

const DashboardPage = () => {
  const [open2FaAuthenticatorModal, setOpen2FaAuthenticatorModal] =
    useState(false);
  const [openEmailVerifyForm, setOpenVerifyEmail] = useState(false);
  const [openCreateBusinessModal, setOpenCreateBusinessModal] = useState(false);

  const [openTicketSLABeachDialog, setOpenTicketBreachDialog] = useState(false);

  const authData = useAuthStore((state) => state.authData);

  const { socket } = useTickectSlaSocket();

  const showTicketSlaAlert = (data: any) => {
    console.log('data', data);
    setOpenTicketBreachDialog(true);
  };

  useEffect(() => {
    if (!authData?.data?.user?.email_verified_at) {
      setOpenVerifyEmail(true);
    } else {
      setOpenVerifyEmail(false);
    }

    socket?.on('ticket_sla_alert', showTicketSlaAlert);

    if (
      Object.keys(authData?.data?.user?.attributes || {}).length === 0 &&
      authData?.data?.user?.email_verified_at
    ) {
      setOpenCreateBusinessModal(true);
    } else {
      setOpenCreateBusinessModal(false);
    }

    if (
      authData?.data?.user?.two_fa_enabled &&
      !authData?.data?.is_2fa_verified
    ) {
      setOpen2FaAuthenticatorModal(true);
    } else {
      setOpen2FaAuthenticatorModal(false);
    }
  }, [authData]);

  return (
    <div className="font-outfit p-10">
      <div className="font-outfit mb-4 text-lg">User Dashboard</div>

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
      <TicketSLABreachDialog
        open={openTicketSLABeachDialog}
        setOpen={setOpenTicketBreachDialog}
      />
    </div>
  );
};

export default DashboardPage;
