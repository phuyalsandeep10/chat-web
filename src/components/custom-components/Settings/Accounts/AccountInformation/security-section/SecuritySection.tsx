'use client';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/ui/Icons';
import ChangePasswordModal from '@/components/modal/ChangePassword/ChangePasswordModal';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';

import React, { useEffect, useRef, useState } from 'react';
import AuthenticatorModal from '@/components/modal/Authenticator/AuthenticatorModal';
import AlertDialogDemo, {
  AlertDialogDemoRef,
} from '@/components/modal/AlertModal';

import { useGenerateTwoFaOtp } from '@/hooks/auth/useGenerateTwoFaOtp';
import { useDisable2Fa } from '@/hooks/auth/useDisable2Fa';

export default function SecuritySection() {
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [open2FaAuthenticatorModal, setOpen2FaAuthenticatorModal] =
    useState(false);

  const authData = useAuthStore((state) => state.authData);

  const {
    mutate: generate2FaOtp,
    isPending: generate2faOtpLoading,
    data: twoFaGeneratedOtpData,
  } = useGenerateTwoFaOtp();

  const {
    mutate: disable2Fa,
    isPending: disable2FaLoading,
    isSuccess: disable2FaSuccess,
  } = useDisable2Fa();

  const confirm2FaModalRef = useRef<AlertDialogDemoRef>(null);
  const disable2FaModalRef = useRef<AlertDialogDemoRef>(null);

  useEffect(() => {
    if (twoFaGeneratedOtpData && !generate2faOtpLoading) {
      setOpen2FaAuthenticatorModal(true);
      confirm2FaModalRef.current?.close();
    }
  }, [twoFaGeneratedOtpData, generate2faOtpLoading]);

  useEffect(() => {
    if (disable2FaSuccess) {
      disable2FaModalRef.current?.close();
    }
  }, [disable2FaSuccess]);

  function handleTwoFaToggle(checked: boolean) {
    if (checked) {
      confirm2FaModalRef.current?.open();
    } else {
      disable2FaModalRef.current?.open();
    }
  }

  return (
    <>
      <div>
        <h3 className="text-brand-dark text-[20px] leading-[30px] font-semibold tracking-[-0.1%]">
          Security
        </h3>

        <div className="mt-6">
          <div className="flex items-center gap-4">
            <Switch
              checked={authData?.data?.user?.two_fa_enabled}
              onCheckedChange={handleTwoFaToggle}
              className="bg-brand-primary-switch data-[state=checked]:bg-brand-primary-switch"
            />
            <span className="text-brand-dark text-[16px] leading-[26px] font-medium">
              Two-factor authentication
            </span>
          </div>

          <Card className="border-theme-text-primary mt-[12px] h-12 w-[80%] rounded-md">
            <CardContent className="flex h-full items-center justify-between p-0">
              <div className="ml-[47px] flex items-center gap-2">
                <Icons.key className="h-5 w-5" />
                <span className="text-brand-dark text-[16px] leading-[26px] font-normal">
                  Change Password
                </span>
              </div>
              <div
                className="mr-[47px]"
                onClick={() => setOpenChangePasswordModal(true)}
              >
                <Icons.pencil className="text-brand-primary h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Custom Signature Section */}
        <div className="mt-6">
          <h3 className="text-brand-dark text-[16px] leading-[26px] font-medium tracking-[0%]">
            Custom Signature
          </h3>

          <Card className="mt-5 h-12 w-[80%] rounded-md border-zinc-500">
            <CardContent className="flex h-full items-center justify-between p-0">
              <div className="ml-[47px] flex items-center gap-2">
                <Icons.key className="h-5 w-5" />
                <span className="text-brand-dark text-[16px] leading-[26px] font-normal tracking-[0%]">
                  Custom Signature
                </span>
              </div>
              <div className="mr-[47px]">
                <Icons.pencil className="text-brand-primary h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ChangePasswordModal
        open={openChangePasswordModal}
        setOpen={setOpenChangePasswordModal}
      />

      <AlertDialogDemo
        ref={confirm2FaModalRef}
        heading="Are you sure?"
        subheading="Turning on 2FA will add an extra layer of security to your account. This action will make your account more secure from attempts of unauthorized access."
        cancelText="Cancel"
        actionText="Turn On 2FA"
        descriptionClassName="text-xs text-black"
        onCancel={() => confirm2FaModalRef.current?.close()}
        onAction={() => generate2FaOtp()}
        actionClassName="py-2.5 px-8 text-xs"
        cancelClassName="py-2.5 px-8 text-xs"
        cancelButtonProps={{
          variant: 'outline',
          size: 'sm',
        }}
        actionButtonProps={{
          variant: 'default',
          size: 'sm',
        }}
        actionIsLoading={generate2faOtpLoading}
      />

      <AlertDialogDemo
        ref={disable2FaModalRef}
        heading="Are you sure?"
        subheading="Turning off 2FA will immediately remove an extra layer of security from your account. This action will make your account more vulnerable to unauthorized access."
        cancelText="Cancel"
        actionText="Turn off 2FA"
        descriptionClassName="text-alert-prominent text-xs"
        icon={<Icons.ri_alert_line className="text-alert-prominent h-5 w-5" />}
        onCancel={() => disable2FaModalRef.current?.close()}
        onAction={() => disable2Fa()}
        cancelButtonProps={{
          variant: 'secondary',
          size: 'sm',
        }}
        actionButtonProps={{
          variant: 'destructive',
          size: 'sm',
        }}
        actionIsLoading={disable2FaLoading}
        actionClassName="py-2.5 px-8 text-xs"
        cancelClassName="py-2.5 px-8 text-xs"
      />

      <AuthenticatorModal
        open={open2FaAuthenticatorModal}
        setOpen={setOpen2FaAuthenticatorModal}
        otpauth_url={twoFaGeneratedOtpData?.data?.['otp_auth_url'] || ''}
        cancelButtonText="Cancel"
        submitButtonText="Submit"
        submitPendingText="Submitting..."
      />
    </>
  );
}
