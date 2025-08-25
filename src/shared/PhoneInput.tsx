'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { z } from 'zod';
import Image from 'next/image';
import { Icons } from '@/components/ui/Icons';
import { useGetCountries } from '@/hooks/organizations/useGetCountries';
import ErrorText from '@/components/common/hook-form/ErrorText';

// Zod Schema
const schema = z.object({
  phoneNumber: z
    .string()
    .min(7, 'Phone number must be at least 7 digits')
    .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
});

// Types
type FormData = z.infer<typeof schema>;

interface Country {
  id: number;
  name: string;
  code: string;
  dialCode: string;
  flagUrl: string;
}

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value = '',
  onChange,
  error,
}) => {
  const { data, isLoading, error: fetchError } = useGetCountries();
  const countries: Country[] = useMemo(() => {
    if (data?.data?.countries?.length) {
      return data.data.countries.map((c: any) => ({
        id: c.id,
        name: c.name,
        code: c.code,
        dialCode: c.phone_code,
        flagUrl: `https://flagcdn.com/24x18/${c.iso_code_2.toLowerCase()}.png`,
      }));
    } else {
      return [
        {
          id: 0,
          name: 'United States',
          code: 'US',
          dialCode: '+1',
          flagUrl: 'https://flagcdn.com/24x18/us.png',
        },
      ];
    }
  }, [data]);

  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>();
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  useEffect(() => {
    if (value && countries.length) {
      const matchedCountry = countries.find((country) =>
        value.startsWith(country.dialCode),
      );
      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
        setPhoneNumber(value.replace(matchedCountry.dialCode, ''));
      } else {
        setSelectedCountry(countries[0]);
        setPhoneNumber(value);
      }
    } else if (!selectedCountry && countries.length) {
      setSelectedCountry(countries[0]);
    }
  }, [value, countries, selectedCountry]);

  const [showDropdown, setShowDropdown] = useState(false);

  const handleCountrySelect = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      setShowDropdown(false);
      if (onChange && phoneNumber) {
        onChange(`${country.dialCode}${phoneNumber}`);
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhoneNumber(newPhone);
    if (onChange && selectedCountry) {
      onChange(`${selectedCountry.dialCode}${newPhone}`);
    }
  };

  return (
    <div className="relative h-9 w-full rounded-md">
      <div className="flex w-full items-center rounded border px-3 py-1">
        {/* Country selector */}
        <div
          className="relative flex cursor-pointer items-center gap-2"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {selectedCountry && (
            <>
              <Image
                width={24}
                height={18}
                src={selectedCountry.flagUrl}
                alt={selectedCountry.code}
                className="h-4 w-auto object-cover"
              />
              <span className="text-sm">{selectedCountry.dialCode}</span>
              <Icons.chevron_down className="mt-0.5 text-xs text-gray-500" />
            </>
          )}
        </div>

        {/* Phone input */}
        <input
          type="text"
          inputMode="numeric"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={handlePhoneChange}
          className="ml-3 flex-1 rounded-md border-none focus:ring-0 focus:outline-none"
          onKeyDown={(e) => {
            if (
              !/[0-9]/.test(e.key) &&
              e.key !== 'Backspace' &&
              e.key !== 'Delete'
            ) {
              e.preventDefault();
            }
          }}
        />
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded border bg-white shadow">
          {countries.map((country) => (
            <li
              key={country.id}
              onClick={() => handleCountrySelect(country.code)}
              className="flex cursor-pointer items-center gap-2 px-3 py-1 hover:bg-gray-100"
            >
              <Image
                width={24}
                height={18}
                src={country.flagUrl}
                alt={country.code}
                className="h-4 w-auto object-cover"
              />
              <span>
                {country.name} ({country.dialCode})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PhoneInput;
