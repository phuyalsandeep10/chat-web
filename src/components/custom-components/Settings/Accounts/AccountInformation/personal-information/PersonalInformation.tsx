import { useCallback, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { debounce } from 'lodash';
import { useMutation } from '@tanstack/react-query';

import { InputField } from '@/components/common/hook-form/InputField';
import { ContactNumberSection } from './ContactNumberSection';

import { FetchProfileFormValues, UpdateProfileFormValues } from '../types';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import { AuthService } from '@/services/auth/auth';
import { toast } from 'sonner';
import { CountrySection } from './CountySection';
import { LanguageSection } from './LanguageSection';

export default function PersonalInformation() {
  const authData = useAuthStore((state) => state.authData);

  const { control, handleSubmit, watch } = useForm<FetchProfileFormValues>({
    defaultValues: {
      name: authData?.data?.user?.name,
      mobile: authData?.data?.user?.mobile,
      address: authData?.data?.user?.address,
      image: authData?.data?.user?.image,
      country: authData?.data?.user?.country,
      language: authData?.data?.user?.language,
      email: authData?.data?.user?.email,
      phone_code: authData?.data?.user?.phone_code,
    },
  });
  const { setAuthData } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async (data: UpdateProfileFormValues) => {
      return await AuthService.updatePersonalInformation(data);
    },
    onSuccess: (data) => {
      setAuthData(data);
      toast.success('Profile Updated Successfully!');
    },
    onError: (error) => {
      toast.error('Profile Not Updated!');
      console.error('Error updating profile:', error);
    },
  });

  const onSubmit: SubmitHandler<UpdateProfileFormValues> = (data) => {
    const updateProfileData: UpdateProfileFormValues = {
      name: data.name,
      mobile: data.mobile,
      address: data.address,
      country: data.country,
      image: data.image,
      language: data.language,
      phone_code_id: data.phone_code_id,
    };
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
        <p className="text-brand-hover mt-2 text-xs leading-[17px] font-normal italic">
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

        <ContactNumberSection
          control={control}
          dialCode={authData?.data?.user?.phone_code}
        />

        <InputField
          control={control}
          name="address"
          label="Address"
          placeholder="Enter your address"
          inputClassName="w-[80%]"
          labelClassName="mt-6 text-[16px] font-medium"
        />
        <CountrySection control={control} name="country" />
        <LanguageSection control={control} name="language" />
      </form>
    </div>
  );
}
