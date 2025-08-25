'use client';

import React from 'react';
import { PlanCard } from './PlanCard';
import { Plan } from './types';

const plans: Plan[] = [
  {
    name: 'Organization',
    company_name: 'Webflex',
    price: 50,
    status: 'Expired',
    note: 'This plan has no renewal date',
    renewal: 'Expired',
  },
  {
    name: 'Business',
    company_name: 'Premium Workspace',
    price: 30,
    status: 'Active',
    note: 'This plan has no renewal date',
    renewal: 'Expires 05, 2025',
  },
  {
    name: 'Starter',
    company_name: 'Premium Workspace',
    price: 0,
    status: 'Active',
    note: 'This plan has no renewal date',
    renewal: 'Free Plan',
  },
  {
    name: 'Organization',
    company_name: 'Premium Workspace',
    price: 50,
    status: 'Expired',
    note: 'This plan has no renewal date',
    renewal: 'Expired',
  },
];

const ManagePlansComponent = () => {
  const handleChangePlan = (planName: string) => {
    console.log(`Changed the plan ${planName}`);
  };

  const handleCancelPlan = (planName: string) => {
    console.log(`Cancelled the plan ${planName}`);
  };

  return (
    <div className="flex flex-col gap-3">
      {plans.map((plan, index) => (
        <PlanCard
          key={index}
          plan={plan}
          onChangePlan={handleChangePlan}
          onCancelPlan={handleCancelPlan}
        />
      ))}
    </div>
  );
};

export default ManagePlansComponent;
