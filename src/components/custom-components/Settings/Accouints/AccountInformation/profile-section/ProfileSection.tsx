import { Icons } from '@/components/ui/Icons';
import { MapPinIcon, PhoneIcon } from 'lucide-react';
import Image from 'next/image';
import { ProfileSectionProps } from '../types';

export default function ProfileSection({
  name,
  email,
  country,
  address,
  phone,
  profileImage,
}: ProfileSectionProps) {
  return (
    <>
      {/* Page title */}
      <div className="text-brand-dark flex items-center">
        <h1 className="text-[32px] leading-[40px] font-semibold">
          Account Information
        </h1>
        <Icons.help className="mt-0.5 ml-2 h-5 w-5" />
      </div>
      <div className="mt-11 flex items-center gap-[126px]">
        <div className="flex items-center gap-6">
          <div className="relative h-[167px] w-[167px] overflow-hidden rounded-[175px]">
            {/* <Image
              src={profileImage ? profileImage : '/profile-placeholder.jpeg'}
              alt="Profile Image"
              fill
              className="object-cover"
            /> */}
            <div className="bg-gray-bg-light absolute bottom-0 flex h-12 w-full items-center justify-center">
              <Icons.pencil className="text-brand-dark h-6 w-6" />
            </div>
          </div>

          <div className="text-brand-dark flex w-[314px] flex-col gap-2">
            <h2 className="text-[40px] leading-[48px] font-bold">{name}</h2>
            <p className="text-[18px] font-normal">{email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          {location && (
            <div className="flex items-center justify-end gap-2">
              <MapPinIcon className="h-3.5 w-3.5" />
              <span className="text-right">{country}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-3.5 w-3.5" />
              <span className="text-right">{phone}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
