import Image from 'next/image';
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCardDetailsProps } from './types';
import { Icons } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

const CreditCardDetails: React.FC<CreditCardDetailsProps> = ({
  expiryYear,
  expiryDate,
  cardImage,
  isPrimary = false,
}) => {
  const currentYear = new Date().getFullYear();
  const isExpired = parseInt(expiryYear) < currentYear;

  let buttonText = 'Set As Default';
  let buttonVariant: React.ComponentProps<typeof Button>['variant'];

  if (isPrimary) {
    buttonText = 'Default';
    buttonVariant = 'black';
  } else if (isExpired) {
    buttonText = 'Expired';
    buttonVariant = 'destructive';
  } else {
    buttonText = 'Set As Default';
    buttonVariant = 'outline_black';
  }

  return (
    <div
      className={`flex items-center gap-43 rounded-[8px] border px-5 py-4 ${
        isPrimary ? 'border-brand-dark' : 'border-gray-light'
      }`}
    >
      <div className="flex items-center gap-2">
        <Image src={cardImage} alt="Card" className="h-12 w-22" />

        <div className="flex flex-col">
          <p className="text-xl leading-7.5 font-semibold text-black">
            Master card ending in {expiryYear}
          </p>
          <p className="text-theme-text-primary text-xs leading-4 font-normal">
            Exp.date {expiryDate}
          </p>
        </div>
      </div>

      <div
        className={cn(
          'flex min-w-[135px] items-center',
          isPrimary ? 'justify-end' : 'justify-between',
        )}
      >
        <Button
          size="sm"
          variant={buttonVariant}
          className={cn(
            'text-xs font-normal',
            isExpired && 'border-theme-text-light text-theme-text-light border',
          )}
        >
          {buttonText}
        </Button>

        {!isPrimary && (
          <Icons.ri_delete_bin_6_fill className="text-alert-prominent h-5 w-5" />
        )}
      </div>
    </div>
  );
};

export default CreditCardDetails;
