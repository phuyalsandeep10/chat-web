import { useState } from 'react';
import CountrySelect from '@/shared/CountrySelect';

import { InputField } from '@/components/common/hook-form/InputField';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ContactNumberSection } from './ContactNumberSection';
import { CountySection } from './CountySection';
import LanguageSection from './LanguageSection';
import { FormValues } from '../types';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import { Country } from '@/services/organizations/types';

export default function PersonalInformation() {
  const authData = useAuthStore((state) => state.authData);
  const { control } = useForm<FormValues>({
    defaultValues: {
      fullName: authData?.data?.user?.name,
      address: 'Rio de Janeiro',
      email: authData?.data?.user?.email,
      country: '',
      language: 'English',
    },
  });
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  return (
    <div>
      <h3 className="text-brand-dark text-[20px] leading-[30px] font-semibold">
        Personal Information
      </h3>

      <form>
        <InputField
          control={control}
          name="fullName"
          label="Full Name"
          placeholder="Enter your full name"
          required
          inputClassName="w-[80%]"
          labelClassName="mt-6 text-[16px] font-medium"
        />
        <p className="mt-2 text-xs leading-[17px] font-normal">
          Your Display Name is visible to the user.
        </p>

        <InputField
          control={control}
          name="email"
          label="Email"
          placeholder="Your Email"
          required
          inputClassName="w-[80%]"
          labelClassName="mt-6 text-[16px] font-medium"
        />

        <ContactNumberSection control={control} />

        <InputField
          control={control}
          name="address"
          label="Address"
          placeholder="Enter you address"
          required
          inputClassName="w-[80%]"
          labelClassName="mt-6 text-[16px] font-medium"
        />

        <CountySection value={selectedCountry} onChange={setSelectedCountry} />

        <LanguageSection />
      </form>
    </div>
  );
}
