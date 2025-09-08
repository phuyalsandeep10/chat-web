'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import Link from 'next/link';
import { forgotPasswordFormSchema } from './forgotPasswordHelper';
import { useForgotPassword } from '@/hooks/auth/useForgotPassword';
import HeadingSubHeadingTypography from '../RegisterForm/HeadingSubHeadingTypography';
import { Icons } from '@/components/ui/Icons';
import { InputField } from '@/components/common/hook-form/InputField';
import { toast } from 'sonner';
import { useState } from 'react';
import SuccessScreen from '../ForgotPasswordVerifyForm/ForgotPasswordSuccess';
import { ROUTES } from '@/routes/routes';

const ForgotPasswordForm = () => {
  const [verifySuccess, setVerifySuccess] = useState(false);
  const { mutate: forgotPass, isPending } = useForgotPassword();

  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordFormSchema>) {
    forgotPass(values, {
      onSuccess: (data) => {
        setVerifySuccess(true);
        toast.success(
          data?.message || 'Password reset email sent successfully',
        );
      },
      onError: (error: any) => {
        setVerifySuccess(false);
        toast.error(
          error?.response?.data?.message ||
            'Failed to submit forgot password request',
        );
        console.error('Forgot Password error:', error);
      },
    });
  }

  return (
    <>
      {!verifySuccess ? (
        <>
          <Link
            href={'/login'}
            className="text-theme-text-primary flex items-center pb-[32px] text-[15px] font-semibold"
          >
            <Icons.chevron_left className="h-4 w-4" />
            Go back
          </Link>

          <HeadingSubHeadingTypography
            heading={
              <>
                Enter your register email address to{' '}
                <span className="text-brand-primary">
                  get a password reset code
                </span>
              </>
            }
          />

          <div className="flex pt-[40px]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                <InputField
                  control={form.control}
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email address"
                  required
                />

                <Button
                  variant="default"
                  type="submit"
                  size="lg"
                  className="mt-4 w-full"
                  disabled={isPending}
                >
                  {isPending ? 'Sending...' : 'Send Reset Code'}
                </Button>

                <div className="text-brand-primary mt-[16px] flex w-full justify-between text-[18px] leading-[29px] underline">
                  <Link href="/login">Return to Sign In</Link>
                  <Link href="/register">Don’t Have an Account</Link>
                  <p>Need Help?</p>
                </div>
              </form>
            </Form>
          </div>
        </>
      ) : (
        <SuccessScreen
          text="SUCCESSFUL"
          subText="Password reset link sent. Please check your email."
          redirectLink={ROUTES.LOGIN}
        />
      )}
    </>
  );
};

export default ForgotPasswordForm;
