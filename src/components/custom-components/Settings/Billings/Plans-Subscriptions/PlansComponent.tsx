import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import Image from 'next/image';
import React from 'react';
import { PlansComponentProps } from './types';

const PlansComponent: React.FC<PlansComponentProps> = ({
  title,
  price,
  subtitle,
  buttonText,
  description,
  features,
  prevPrice,
  showImage = true,
  imageSrc,
  bgColor = '',
  className = '',
  buttonVariant,
  buttonOnClick,
  size,
  buttonClassName,
}) => {
  return (
    <div
      className={`border-grey-light grid gap-8 rounded-md border p-3 ${bgColor} ${className}`}
    >
      <div className="flex min-w-[248px] flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-brand-dark flex items-center gap-2 text-lg leading-7 font-medium">
            {showImage && imageSrc && (
              <Image src={imageSrc} alt="Fire flame" className="h-5 w-5" />
            )}
            {title}
          </h1>
          <p className="text-gray-dark flex items-center gap-4 text-2xl leading-9 font-semibold">
            {prevPrice && (
              <span className="text-theme-text-light line-through">
                {prevPrice}
              </span>
            )}
            <span>{price}</span>
          </p>
          <p className="text-gray-primary text-xs leading-5 font-normal">
            {subtitle}
          </p>
          <Button
            variant={buttonVariant}
            size={size}
            className={`${buttonClassName} w-full rounded-[4px] py-5 text-xs`}
            onClick={buttonOnClick}
          >
            {buttonText}
          </Button>
          <p className="text-theme-text-primary text-xs leading-5 font-normal">
            {description}
          </p>
        </div>
        <div className="text-theme-text-primary text-sm leading-5 font-normal">
          {features.map((feature, index) => (
            <p key={index} className="flex items-center gap-2">
              <Icons.ri_check_fill className="text-theme-text-primary h-4 w-4" />
              {feature}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlansComponent;
