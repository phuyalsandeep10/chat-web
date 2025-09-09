'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import Image from 'next/image';
import { Icons } from '@/components/ui/Icons';
import { allCountries } from 'country-telephone-data';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';
import { UpdateProfileFormValues } from '../types';
import { AuthService } from '@/services/auth/auth';
import { toast } from 'sonner';

interface Country {
  name: string;
  code: string;
  dialCode: string;
  flagUrl: string;
}

interface PhoneCode {
  dial_code: string;
  created_at: string;
  updated_at: string;
  id: number;
  name: string;
  code: string;
}

// Map raw country data to usable display info
const countries: Country[] = allCountries.map((c) => ({
  name: c.name,
  code: c.iso2.toUpperCase(),
  dialCode: `+${c.dialCode}`,
  flagUrl: `https://flagcdn.com/24x18/${c.iso2?.toLowerCase()}.png`,
}));

type PhoneInputProps = {
  field: ControllerRenderProps<any, any>;
  storeDialCode?: string;
};

const PhoneInput: React.FC<PhoneInputProps> = ({ field, storeDialCode }) => {
  const authData = useAuthStore((state) => state.authData);

  const [data, setData] = useState<PhoneCode[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>();
  const [dialCode, setDialCode] = useState<number | undefined>(); // backend ID
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // Fetch backend phone code list (contains IDs)
  useEffect(() => {
    const fetchPhoneCode = async () => {
      const result = await AuthService.fetchPhoneCodes();
      setData(result);
    };
    fetchPhoneCode();
  }, []);

  useEffect(() => {
    if (data?.length === 0) return;

    let matchedPhoneCode: PhoneCode | undefined;

    if (storeDialCode) {
      matchedPhoneCode = data.find((item) => item.dial_code === storeDialCode);
    }

    if (matchedPhoneCode) {
      const country = countries.find(
        (c) => c.code === matchedPhoneCode!.code.toUpperCase(),
      );
      if (country) {
        setSelectedCountry(country);
        setDialCode(Number(matchedPhoneCode.dial_code));
      }
    } else {
      // Fallback: NEPAL
      const fallbackCountry = countries.find((c) => c.dialCode === '+977');
      const fallbackPhoneCode = data.find(
        (d) => d.dial_code.toUpperCase() === '+977',
      );
      if (fallbackCountry && fallbackPhoneCode) {
        setSelectedCountry(fallbackCountry);
        setDialCode(Number(fallbackPhoneCode.dial_code));
      }
    }
  }, [data, storeDialCode]);

  // Submit backend ID if it changes
  const handleDialCode = useCallback(async () => {
    if (!dialCode || !authData?.data?.user) return;

    // Avoid submitting the same value
    if (dialCode === Number(storeDialCode)) return;

    const phoneDialUpdate: UpdateProfileFormValues = {
      name: authData.data.user.name || '',
      country: authData.data.user.country || '',
      image: authData.data.user.image || '',
      language: authData.data.user.language || '',
      mobile: authData.data.user.mobile || '',
      email: authData.data.user.email || '',
      address: authData.data.user.address || '',
      phone_code_id: dialCode,
    };

    // update here
    if (dialCode !== Number(storeDialCode)) {
      const res = await AuthService.updatePersonalInformation(phoneDialUpdate);
      if (res) toast.success('Dial Code Updated!');
      else toast.error('Dial Code Update Failed');
    }
  }, [dialCode, authData, storeDialCode]);

  useEffect(() => {
    handleDialCode();
  }, [dialCode]);

  // On dropdown selection
  const handleCountrySelect = (countryCode: string) => {
    const selected = countries.find((c) => c.code === countryCode);
    const matched = data.find((d) => d.code.toUpperCase() === countryCode);

    if (selected && matched) {
      setSelectedCountry(selected);
      setDialCode(matched.id); // use backend ID for update
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative h-9 w-full rounded-[4px]">
      <div className="flex w-full items-center rounded border px-3 py-1">
        {/* Country Selector */}
        <div
          className="relative flex cursor-pointer items-center gap-2"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {selectedCountry && (
            <>
              <Image
                width={24}
                height={18}
                src={selectedCountry?.flagUrl}
                alt={selectedCountry?.code}
                className="h-4 w-6 object-cover"
              />
              <span className="text-sm">{selectedCountry.dialCode}</span>
              <Icons.chevron_down className="mt-0.5 text-xs text-gray-500" />
            </>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="text"
          inputMode="numeric"
          placeholder="Enter phone number"
          {...field}
          className="ml-3 flex-1 rounded-md border-none text-[14px] leading-[21px] focus:ring-0 focus:outline-none"
          onKeyDown={(e) => {
            const isDigit = /[0-9]/.test(e.key);
            const isAllowedKey = [
              'Backspace',
              'Delete',
              'ArrowLeft',
              'ArrowRight',
              'Tab',
            ].includes(e.key);
            const input = e.currentTarget;
            const isSelection = input.selectionStart !== input.selectionEnd;

            if (!isDigit && !isAllowedKey) {
              e.preventDefault();
            }

            if (isDigit && input.value.length >= 16 && !isSelection) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 16);
            field.onChange(digitsOnly);
          }}
        />
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded border bg-white shadow">
          {/* Search Input */}
          <div className="sticky top-0 z-10 border-b bg-white p-2">
            <input
              type="text"
              placeholder="Search country code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded border px-2 py-1 text-sm"
            />
          </div>

          {/* Country List */}
          <ul>
            {countries
              .filter(
                (country) =>
                  country.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  country.dialCode.includes(searchTerm),
              )
              .map((country) => {
                console.log(country);
                return (
                  <li
                    key={country.code}
                    onClick={() => handleCountrySelect(country.code)}
                    className="flex cursor-pointer items-center gap-2 px-3 py-1 hover:bg-gray-100"
                  >
                    <Image
                      width={24}
                      height={18}
                      src={country.flagUrl}
                      alt={country.code}
                      className="h-4 w-6 object-cover"
                    />
                    <span>
                      {country.name} ({country.dialCode})
                    </span>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PhoneInput;
