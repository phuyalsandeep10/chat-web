'use client';

import React, { useState } from 'react';
import CreditCardDetails from './CreditCardDetails';
import Settings from '@/components/custom-components/Settings/Settings';
import visacard from '@/assets/images/visa-card.svg';
import mastercard from '@/assets/images/Mastercard-logo.svg';
import stripe from '@/assets/images/stripe.svg';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import InvoiceTable from './InvoiceTable';
import AddPaymentModal from './AddPaymentModal';
import HeaderComponent from '../Plans-Subscriptions/Header';
import CreditCard from './CreditCard';

const creditCardData = [
  {
    cardLabel: 'Credit card',
    cardNumber: 'xxxx xxxx xxxx 2364',
    cardholderName: 'Jane Doe',
    cardholderAddress: 'Kathmandu, Bagmati, Nepal',
    expiryDate: '09/25',
  },
  {
    cardLabel: 'Credit card',
    cardNumber: 'xxxx xxxx xxxx 2364',
    cardholderName: 'Jane Doe',
    cardholderAddress: 'Kathmandu, Bagmati, Nepal',
    expiryDate: '09/25',
  },
];

const creditCardDetailsData = [
  {
    expiryYear: '7080',
    expiryDate: '06/24',
    cardImage: visacard,
    buttonText: 'Default',
  },
  {
    expiryYear: '7080',
    expiryDate: '06/24',
    cardImage: mastercard,
    buttonText: 'Default',
  },
  {
    expiryYear: '2019',
    expiryDate: '06/24',
    cardImage: stripe,
    buttonText: 'Default',
  },
];

const CardsInvoices = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Settings>
      <div className="font-outfit">
        <div className="mb-10">
          <HeaderComponent heading="Cards and Invoices" />
        </div>

        <div className="mb-10 flex gap-5">
          <div className="flex flex-col gap-6">
            {creditCardData.map((card, index) => (
              <CreditCard key={index} {...card} isPrimary={index === 0} />
            ))}
          </div>

          <div className="flex flex-col gap-6">
            {creditCardDetailsData.map((details, index) => (
              <CreditCardDetails
                key={index}
                {...details}
                isPrimary={index === 0}
              />
            ))}
            <Button
              onClick={() => setModalOpen(true)}
              leftIcon={<Icons.ri_add_circle_line className="h-6 w-6" />}
              className="rounded-[4px] text-xs"
            >
              Add Payment Option
            </Button>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-3">
          <HeaderComponent heading="Billing History" className="text-xl" />
          <p className="text-theme-text-primary text-[16px] leading-6.5 font-normal">
            Invoices and their details are given below.
          </p>
        </div>
        <div>
          <InvoiceTable />
        </div>
        <AddPaymentModal open={modalOpen} onOpenChange={setModalOpen} />
      </div>
    </Settings>
  );
};

export default CardsInvoices;
