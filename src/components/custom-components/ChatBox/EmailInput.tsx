'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useChatBox } from './chatbox.provider';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import chatBoxAxiosInstance from '@/apiConfigs/chatBoxAxiosInstance';

const EmailInputSchema = z.object({
  email: z.email('Invalid email'),
});

const EmailInput = () => {
  const { visitor, setVisitor } = useChatBox();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof EmailInputSchema>
  >({
    resolver: zodResolver(EmailInputSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof EmailInputSchema>) => {
    setLoading(true);
    console.log(data);
    // return
    const response = await chatBoxAxiosInstance.put(
      `/customers/${visitor.customer.id}/customer-email`,
      data,
    );
    const result = response?.data;
    const payload = {
      ...visitor,
      customer: result?.data,
    };
    setSuccess(true);
    setVisitor(payload);
    localStorage.setItem('visitor', JSON.stringify(payload));
    console.log(response);
    setLoading(false);
  };

  const { errors } = formState;
  // console.log(errors);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="font-outfit mt-4 flex gap-4"
    >
      <div className="flex items-end">
        <div className="flex items-center justify-center rounded-full">
          <Image
            src="/widget-logo-bottom.svg"
            height={12}
            width={12}
            className="-ml-5 h-18 w-18"
            alt="bot icon"
          />
        </div>
      </div>
      <div className="font-inter -ml-6 w-full rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[2px] border border-[rgba(170,170,170,0.10)] bg-white px-2.5 py-2">
        {visitor?.customer?.email || success ? (
          <p className="text-sm">
            Your email has been submitted we will contact{' '}
            <span className="text-brand-primary">
              {visitor?.customer?.email}
            </span>{' '}
            you later.{' '}
          </p>
        ) : (
          <>
            <p className="text-[11px]">
              Thank you for your message!😄 <br />
              How can I help you today?
            </p>

            <div className="mt-[7px] flex w-full flex-col">
              <input
                type="email"
                placeholder="Enter your Email"
                className="w-full rounded-md border p-2 text-xs outline-none placeholder:text-xs"
                {...register('email')}
              />
              {errors?.email && (
                <p className="text-error mt-1 text-xs">
                  {errors?.email?.message}
                </p>
              )}
            </div>
            <button
              disabled={loading}
              type="submit"
              className={cn(
                `bg-brand-primary mt-2 rounded-md border p-2 text-xs text-white`,
                loading && 'bg-secondary-disabled cursor-not-allowed',
              )}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default EmailInput;
