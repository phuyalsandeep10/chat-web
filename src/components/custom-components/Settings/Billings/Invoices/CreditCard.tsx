import React from 'react';
import Image from 'next/image';
import mastercard from '@/assets/images/Mastercard-logo.svg';
import { CreditCardProps } from './types';

const CreditCard: React.FC<CreditCardProps> = ({
  cardLabel,
  cardNumber,
  cardholderName,
  cardholderAddress,
  expiryDate,
  isPrimary = false,
}) => {
  return (
    <div
      className={`custom-gradient-2 h-[180px] w-[300px] rounded-[8px] px-7 py-6 ${
        isPrimary ? 'border-brand-primary border-[4px]' : ''
      }`}
      style={isPrimary ? { boxShadow: '-3px 4px 4px 0px #6304824A' } : {}}
    >
      <div className="mb-12.5">
        <div className="flex justify-between text-white">
          <div className="space-y-1">
            <p className="text-[16px] leading-6.5 font-semibold">{cardLabel}</p>
            <p className="text-sm leading-5 font-medium">{cardNumber}</p>
          </div>

          <div className="-mt-3">
            <Image src={mastercard} alt="Mastercard" className="h-8.5 w-11" />
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-white">
          <div className="space-y-1">
            <p className="text-sm leading-4 font-normal">{cardholderName}</p>
            <p className="text-sm leading-4 font-normal">{cardholderAddress}</p>
          </div>

          <div>
            <p className="mt-5 text-sm leading-[100%] font-medium">
              {expiryDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
