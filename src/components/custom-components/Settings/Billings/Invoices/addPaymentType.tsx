import Image from 'next/image';
import React from 'react';
import { Icons } from '@/components/ui/Icons';
import { AddPaymentTypeProps } from './types';

const AddPaymentType: React.FC<AddPaymentTypeProps> = ({
  image,
  alt,
  title,
  subtitle,
}) => {
  return (
    <div className="border-gray-light rounded-[8px] border px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-5">
          <Image
            src={image}
            alt={alt}
            className="border-theme-text-light h-[48px] w-[86px] rounded border"
          />

          <div className="flex flex-col">
            <p className="text-xl leading-7.5 font-semibold">{title}</p>
            <p className="text-theme-text-primary font-regular text-xs leading-4.5">
              {subtitle}
            </p>
          </div>
        </div>
        <Icons.chevron_down className="h-6 w-6 text-black" />
      </div>
    </div>
  );
};

export default AddPaymentType;
