'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { CardComponentProps } from './types';
import { Star } from 'lucide-react';
import { Icons } from '@/components/ui/Icons';

const CardComponent: React.FC<CardComponentProps> = ({
  image,
  name,
  description,
  price = 'Free',
  websiteUrl,
  route,
  isConnected,
  onConnectionChange,
}) => {
  const router = useRouter();
  const [starred, setStarred] = useState(false);

  const handleCardClick = () => {
    if (route) {
      router.push(route);
    }
  };

  return (
    <div
      className="border-gray-light cursor-pointer rounded-lg border"
      onClick={handleCardClick}
    >
      <div className="pt-3.5 pr-1.5 pl-3.5">
        <div className="flex min-h-[32px] items-center justify-between">
          <Image src={image} alt={name} width={32} height={32} />
          <div className="flex gap-1">
            <Icons.ri_links_fill className="text-gray-primary size-4.5" />
            <p className="text-gray-primary text-xs leading-4 font-normal">
              {websiteUrl}
            </p>
          </div>
        </div>

        <div className="mt-1 flex justify-between">
          <div className="flex items-center gap-2">
            <p className="text-base leading-6.5 font-medium">{name}</p>
            <Star
              onClick={(e) => {
                e.stopPropagation();
                setStarred((prev) => !prev);
              }}
              className={`h-3.5 w-3.5 cursor-pointer ${
                starred
                  ? 'fill-brand-primary text-brand-primary'
                  : 'text-brand-primary'
              }`}
            />
          </div>
          <p className="text-sm leading-5 font-medium">{price}</p>
        </div>

        <p className="text-theme-text-primary mb-[21px] text-xs leading-4 font-normal">
          {description}
        </p>
      </div>

      <div
        className="border-gray-light flex justify-between rounded-t-[8px] border-t py-3 pr-2 pl-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1">
          {isConnected ? (
            <Icons.ri_settings_5_fill className="text-brand-primary size-3.5" />
          ) : (
            <Icons.ri_plug_line className="text-brand-primary size-3.5" />
          )}
          <p className="text-brand-primary text-xs leading-4 font-semibold">
            {isConnected ? 'Configure' : 'Connect'}
          </p>
        </div>
        <Switch
          className="data-[state=checked]:bg-brand-primary"
          checked={isConnected}
          onCheckedChange={onConnectionChange}
        />
      </div>
    </div>
  );
};

export default CardComponent;
