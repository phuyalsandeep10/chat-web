'use client';

import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/routes/routes';
import Link from 'next/link';
import { baseURL } from '@/apiConfigs/axiosInstance';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { loginFormSchema } from './loginHelper';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthService } from '@/services/auth/auth';
import { useLoginUser } from '@/hooks/auth/useLoginUser';
import HeadingSubHeadingTypography from '../RegisterForm/HeadingSubHeadingTypography';
import { InputField } from '@/components/common/hook-form/InputField';
import Button from '@/components/common/hook-form/Button';
import ReCAPTCHA from 'react-google-recaptcha';
import Image from 'next/image';
import googleIcon from '@/assets/images/google.svg';
import { toast } from 'sonner';
import { useRedirectIfAuthenticated } from '@/hooks/auth/useRedirectIfAuthenticated';

const LoginForm = () => {
  const [isNotARobot, setIsNotARobot] = useState(false);
  const [captchaError, setCaptchaError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');

  const { mutate: login, isPending } = useLoginUser();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    if (!isNotARobot) {
      setCaptchaError('Please verify that you are not a robot.');
      return;
    }
    setCaptchaError('');
    login(values, {
      onSuccess: (data) => {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', values.email);
          localStorage.setItem('rememberedPassword', values.password);
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
        }

        const authToken = {
          accessToken: data?.data?.access_token,
          refreshToken: data?.data?.refresh_token,
        };
        AuthService.setAuthTokens(authToken);
        toast.success(data?.message || 'Logged in successfully');
        router.replace(ROUTES.YOUR_INBOXES.MAIN_INBOX); //re-route directly to inbox for now
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Login failed');
      },
    });
  }

  const onCaptchaSuccess = (value: string | null) => {
    if (value) {
      setIsNotARobot(true);
      setCaptchaError('');
    } else {
      setIsNotARobot(false);
      setCaptchaError('Captcha failed. Please try again.');
    }
  };

  useEffect(() => {
    if (accessToken && refreshToken) {
      const authTokens = {
        accessToken,
        refreshToken,
      };
      AuthService.setAuthTokens(authTokens);
      router.replace(ROUTES.DASHBOARD);
    }
  }, [accessToken, refreshToken, router]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      form.setValue('email', savedEmail);
      form.setValue('password', savedPassword);
      setRememberMe(true);
    }
  }, [form]);

  // useRedirectIfAuthenticated()

  return (
    <>
      <HeadingSubHeadingTypography
        heading={
          <>
            Login to <span className="text-brand-primary">Chatboq</span>
          </>
        }
        subHeading="Login to Chatboq account to access your dashboard."
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4 pt-10 pb-[16px]"
        >
          <InputField
            control={form.control}
            name="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            required
          />
          <InputField
            control={form.control}
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
          />
          <div>
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="accent-brand-primary border-grey-light h-4 w-4"
                  checked={rememberMe}
                  onChange={(e) => {
                    setRememberMe(e.target.checked);
                    if (!e.target.checked) {
                      localStorage.removeItem('rememberedEmail');
                    }
                  }}
                />
                <span className="text-[14px] leading-[21px] font-normal">
                  Remember Me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-brand-primary text-[14px] leading-[21px] font-normal"
              >
                Forgot password?
              </Link>
            </div>

            {/* ReCAPTCHA */}
            <div className="w-full pt-4">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTHA_SITE_KEY!}
                onChange={onCaptchaSuccess}
              />
              {captchaError && (
                <p className="text-error mt-2 text-sm">{captchaError}</p>
              )}
            </div>
          </div>

          <Button
            variant="default"
            type="submit"
            size="lg"
            className="mt-4 w-full"
            disabled={isPending}
          >
            {isPending ? 'Logging in...' : 'Login to Dashboard'}
          </Button>

          <p className="text-center font-medium">Or</p>

          <Button
            variant="outline"
            type="button"
            size="lg"
            className="w-full"
            leftIcon={
              <Image
                src={googleIcon}
                alt="Google icon"
                width={20}
                height={20}
              />
            }
            onClick={() => window.open(`${baseURL}/auth/oauth/google`)}
          >
            Continue With Google
          </Button>

          <p className="text-center">
            Don’t have an account?
            <Link
              href="/register"
              className="text-brand-primary ml-2 text-lg hover:underline"
            >
              Signup
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
