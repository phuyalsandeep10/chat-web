'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { addPaymentHelperSchema } from './addPaymentHelper';
import { InputField } from '@/components/common/hook-form/InputField';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import CheckboxAgreement from './CheckboxAgreement';

const AddPaymentForm = () => {
  const [isAgreed, setIsAgreed] = useState(false);
  const [isAgreeError, setIsAgreeError] = useState('');

  const form = useForm<z.infer<typeof addPaymentHelperSchema>>({
    resolver: zodResolver(addPaymentHelperSchema),
    defaultValues: {
      cardHolderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      country: '',
      state: '',
      city: '',
      zip: '',
    },
  });

  const onSubmit = (data: z.infer<typeof addPaymentHelperSchema>) => {
    if (!isAgreed) {
      setIsAgreeError('You must agree to the terms.');
      return;
    }
    setIsAgreeError('');
    console.log('Submitted:', data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        {/* Card details */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            labelClassName="font-medium text-[16px] mb-3"
            control={form.control}
            name="cardHolderName"
            label="Card Holder Name"
            className="text-theme-text-primary"
            required
          />
          <InputField
            labelClassName="font-medium text-[16px] mb-3"
            control={form.control}
            name="cardNumber"
            label="Card Number"
            className="text-theme-text-primary"
            required
          />
          <InputField
            labelClassName="font-medium text-[16px] mb-3"
            control={form.control}
            name="expiryDate"
            label="Expiry Date"
            className="text-theme-text-primary"
            required
          />
          <InputField
            labelClassName="font-medium text-[16px] mb-3"
            control={form.control}
            name="cvv"
            label="CVV"
            className="text-theme-text-primary"
            required
          />
        </div>

        {/* Billing Address */}
        <div>
          <h3 className="text-brand-dark my-6 text-xl leading-7.5 font-semibold">
            Billing address
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <InputField
              labelClassName="font-medium text-[16px] mb-3"
              control={form.control}
              name="country"
              label="Country"
              className="text-theme-text-primary"
              required
            />
            <InputField
              labelClassName="font-medium text-[16px] mb-3"
              control={form.control}
              name="state"
              label="State"
              className="text-theme-text-primary"
              required
            />
            <InputField
              labelClassName="font-medium text-[16px] mb-3"
              control={form.control}
              name="city"
              label="City"
              className="text-theme-text-primary"
              required
            />
            <InputField
              labelClassName="font-medium text-[16px] mb-3"
              control={form.control}
              name="zip"
              label="Zip"
              className="text-theme-text-primary"
              required
            />
          </div>
        </div>

        <CheckboxAgreement
          label="I have read and accept the terms of use, rules and privacy policy"
          checked={isAgreed}
          onChange={setIsAgreed}
          error={isAgreeError}
        />

        <Button variant="default" type="submit" className="mt-4 w-full">
          <Icons.ri_add_circle_line className="h-6 w-6" />
          Add Card
        </Button>

        <p className="text-theme-text-light text-center text-xs font-normal">
          Encrypted and secure payments
        </p>
      </form>
    </FormProvider>
  );
};

export default AddPaymentForm;
