import { StaticImageData } from 'next/image';

export type CreditCardProps = {
  cardLabel: string;
  cardNumber: string;
  cardholderName: string;
  cardholderAddress: string;
  expiryDate: string;
  isPrimary?: boolean;
};

export type CreditCardDetailsProps = {
  expiryYear: string;
  expiryDate: string;
  cardImage: StaticImageData;
  buttonText: string;
  isPrimary?: boolean;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  billingAdmin: {
    name: string;
    email: string;
    profile: string | StaticImageData;
  };
  billingDate: string;
  amount: string;
  numOfUsers: number;
  status: 'paid';
};

export type CheckboxAgreementProps = {
  id?: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  className?: string;
};

export type AddPaymentTypeProps = {
  image: StaticImageData;
  alt: string;
  title: string;
  subtitle: string;
};
