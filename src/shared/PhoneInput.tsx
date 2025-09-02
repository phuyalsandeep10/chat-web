'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Icons } from '@/components/ui/Icons';
import { allCountries } from 'country-telephone-data';

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
  name: string;
  code: string;
  dialCode: string;
  flagUrl: string;
}

// Map countries
const countries: Country[] = allCountries.map((c) => ({
  name: c.name,
  code: c.iso2.toUpperCase(),
  dialCode: `+${c.dialCode}`,
  flagUrl: `https://flagcdn.com/24x18/${c.iso2}.png`,
}));

const PhoneInput: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
    countries.find((c) => c.code === 'US'),
  );
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const handleCountrySelect = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      setShowDropdown(false);
    }
  };

  const onSubmit = (data: FormData) => {
    const fullPhone = `${selectedCountry?.dialCode}${data.phoneNumber}`;
  };

  return (
    // <form onSubmit={handleSubmit(onSubmit)}>
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
                className="h-4 w-6 object-cover"
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
          {...register('phoneNumber')}
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

      {/* Error display */}
      {errors.phoneNumber && (
        <p className="mt-1 text-xs text-red-500">
          {errors.phoneNumber.message}
        </p>
      )}

      {/* Dropdown */}
      {showDropdown && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded border bg-white shadow">
          {countries.map((country) => (
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
          ))}
        </ul>
      )}
    </div>
    // </form>
  );
};

export default PhoneInput;
