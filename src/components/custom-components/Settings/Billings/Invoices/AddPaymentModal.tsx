'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Icons } from '@/components/ui/Icons';
import AddPaymentForm from './addPaymentForm';
import AddPaymentType from './addPaymentType';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import visaCard from '@/assets/images/visa-card.svg';
import masterCard from '@/assets/images/Mastercard-logo.svg';
import maestroCard from '@/assets/images/maestro-card.svg';
import stripe from '@/assets/images/stripe.svg';
import clsx from 'clsx';

interface AddPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleForm = () => setIsOpen((prev) => !prev);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!w-[746px] !max-w-[746px]"
        showCloseButton={false}
      >
        <div className="mb-4 flex items-center justify-between">
          <DialogTitle className="text-[32px] leading-10 font-semibold">
            Add Payment Method
          </DialogTitle>
          <DialogClose>
            <Icons.ri_close_circle_fill />
          </DialogClose>
        </div>

        <div
          className={clsx(
            'border-gray-light rounded-[8px] border transition-all duration-300',
            isOpen ? 'px-5 py-8' : 'px-5 py-4',
          )}
        >
          <div
            className={clsx(
              'flex cursor-pointer items-center justify-between',
              isOpen && 'mb-7',
            )}
            onClick={toggleForm}
          >
            <p className="text-brand-dark text-xl font-semibold">
              Card Payment
            </p>
            <div className="flex gap-9.5">
              <div className="flex items-center gap-3">
                <Image src={visaCard} alt="visa-card" className="h-6 w-11" />
                <Image
                  src={masterCard}
                  alt="master-card"
                  className="h-6 w-11"
                />
                <Image
                  src={maestroCard}
                  alt="maestro-card"
                  className="h-6 w-11"
                />
              </div>
              {isOpen ? (
                <Icons.chevron_up className="text-brand-dark h-6 w-6" />
              ) : (
                <Icons.chevron_down className="text-brand-dark h-6 w-6" />
              )}
            </div>
          </div>

          {isOpen && <AddPaymentForm />}
        </div>

        <div className="mt-3 mb-6 flex flex-col gap-6">
          <AddPaymentType
            image={stripe}
            alt="Stripe"
            title="Add Stripe payment"
            subtitle="All credit card providers are supported"
          />
          <div className="opacity-50">
            <AddPaymentType
              image={masterCard}
              alt="stripe"
              title="Add a credit card"
              subtitle="All credit card providers are supported"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentModal;
