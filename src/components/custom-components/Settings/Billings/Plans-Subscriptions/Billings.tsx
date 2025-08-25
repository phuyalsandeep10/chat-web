'use client';
import React from 'react';
import Settings from '@/components/custom-components/Settings/Settings';
import HeaderComponent from './Header';
import ActivePlansComponent from './ActivePlans';

const Billings = () => {
  return (
    <Settings>
      <div className="font-outfit">
        <div className="pb-6">
          <HeaderComponent heading="Plans & Subscriptions" />
          <ActivePlansComponent />
        </div>
      </div>
    </Settings>
  );
};

export default Billings;
