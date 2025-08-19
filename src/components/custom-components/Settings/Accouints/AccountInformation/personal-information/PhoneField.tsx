'use client';

import React, { useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import Image from 'next/image';
import { Icons } from '@/components/ui/Icons';
import { allCountries } from 'country-telephone-data';

interface Country {
  name: string;
  code: string;
  dialCode: string;
  flagUrl: string;
}

const countries: Country[] = allCountries.map((c) => ({
  name: c.name,
  code: c.iso2.toUpperCase(),
  dialCode: `+${c.dialCode}`,
  flagUrl: `https://flagcdn.com/24x18/${c.iso2}.png`,
}));

type PhoneInputProps = {
  field: ControllerRenderProps<any, any>; // from react-hook-form
};

const PhoneInput: React.FC<PhoneInputProps> = ({ field }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
    countries.find((c) => c.code === 'US'),
  );

  const [searchTerm, setSearchTerm] = useState('');

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const handleCountrySelect = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
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
                src={selectedCountry.flagUrl}
                alt={selectedCountry.code}
                className="h-4 w-6 object-cover"
              />
              <span className="text-sm">{selectedCountry.dialCode}</span>
              <Icons.chevron_down className="mt-0.5 text-xs text-gray-500" />
            </>
          )}
        </div>

        {/* Input Field */}
        <input
          type="text"
          // name="contact"
          inputMode="numeric"
          placeholder="Enter phone number"
          {...field}
          className="ml-3 flex-1 rounded-md border-none text-[14px] leading-[21px] focus:ring-0 focus:outline-none"
          onKeyDown={(e) => {
            if (
              !/[0-9]/.test(e.key) &&
              e.key !== 'Backspace' &&
              e.key !== 'Delete'
            ) {
              e.preventDefault();
            }
          }}
          value={
            field.value?.replace(selectedCountry?.dialCode || '', '') || ''
          }
          onChange={(e) =>
            field.onChange(`${selectedCountry?.dialCode}${e.target.value}`)
          }
        />
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded border bg-white shadow">
          {/* Search Field */}
          <div className="sticky top-0 z-10 border-b bg-white p-2">
            <input
              type="text"
              placeholder="Search country Code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded border px-2 py-1 text-sm"
            />
          </div>

          {/* Filtered Country List */}
          <ul>
            {countries
              .filter(
                (country) =>
                  country.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  country.dialCode.includes(searchTerm),
              )
              .map((country) => (
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
        </div>
      )}
    </div>
  );
};

export default PhoneInput;
