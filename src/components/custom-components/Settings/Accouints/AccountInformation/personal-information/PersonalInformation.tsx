import { useCallback, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { debounce } from 'lodash';
import { useMutation, useQuery } from '@tanstack/react-query';

import { InputField } from '@/components/common/hook-form/InputField';
import { ContactNumberSection } from './ContactNumberSection';
import { CountySection } from './CountySection';
import LanguageSection from './LanguageSection';

import { UpdateProfileFormValues } from '../types';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import { AuthService } from '@/services/auth/auth';
import { Country } from '@/shared/CountrySelect';

export default function PersonalInformation() {
  const authData = useAuthStore((state) => state.authData);

  const { control, handleSubmit, watch } = useForm<UpdateProfileFormValues>({
    defaultValues: {
      name: authData?.data?.user?.name,
      image: authData?.data?.user?.image,
      mobile: authData?.data?.user?.mobile,
      address: authData?.data?.user?.address,
      country: authData?.data?.user?.country,
      language: 'English',
      email: authData?.data?.user?.email,
    },
  });

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: UpdateProfileFormValues) => {
      return await AuthService.updatePersonalInformation(data);
    },
    onSuccess: () => {
      console.log('Profile updated successfully');
      // refetchUserData();
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
    },
  });

  const onSubmit: SubmitHandler<UpdateProfileFormValues> = (data) => {
    const updateProfileData: UpdateProfileFormValues = {
      name: data.name,
      mobile: data.mobile,
      address: data.address,
      country: data.country,
      language: data.language,
    };
    console.log(updateProfileData);
    mutation.mutate(updateProfileData);
  };

  const debouncedSubmit = useCallback(
    debounce((data: UpdateProfileFormValues) => {
      handleSubmit(onSubmit)();
    }, 2000),
    [handleSubmit],
  );

  useEffect(() => {
    const subscription = watch((data) => {
      debouncedSubmit(data as UpdateProfileFormValues);
    });

    return () => {
      subscription.unsubscribe();
      debouncedSubmit.cancel();
    };
  }, [watch, debouncedSubmit]);

  return (
    <div>
      <h3 className="text-brand-dark text-[20px] leading-[30px] font-semibold">
        Personal Information
      </h3>

      <form>
        <InputField
          control={control}
          name="name"
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
          disabled
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
          placeholder="Enter your address"
          required
          inputClassName="w-[80%]"
          labelClassName="mt-6 text-[16px] font-medium"
        />

        <CountySection value={selectedCountry} onChange={setSelectedCountry} />
        <LanguageSection />

        {/* Optional loading/error display */}
        {mutation.isPending && (
          <p className="mt-2 text-sm text-gray-500">Updating...</p>
        )}
        {mutation.isError && (
          <p className="mt-2 text-sm text-red-500">Error updating profile.</p>
        )}
        {mutation.isSuccess && (
          <p className="mt-2 text-sm text-green-600">Profile updated!</p>
        )}
      </form>
    </div>
  );
}
