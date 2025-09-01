'use client';

import { Controller, Control } from 'react-hook-form';
import PhoneInput from './PhoneField';
import { Label } from '@/components/ui/label';

type ContactNumberSectionProps = {
  control: Control<any>;
  dialCode?: string;
};

export const ContactNumberSection = ({
  control,
  dialCode,
}: ContactNumberSectionProps) => {
  return (
    <div className="mt-[18px]">
      <Label
        aria-required
        className="text-brand-dark text-[16px] leading-[26px] font-medium"
      ></Label>
      <div className="mt-3 w-[80%]">
        <Controller
          name="mobile"
          control={control}
          render={({ field }) => (
            <PhoneInput field={field} storeDialCode={dialCode} />
          )}
        />
      </div>
    </div>
  );
};
