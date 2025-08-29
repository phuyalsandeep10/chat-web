'use client';
import React, { useState } from 'react';
import YearlyPlans from './YearlyPlans';
import MonthlyPlans from './MonthlyPlans';
import { ToggleOption } from './types';

const ActivePlansComponent = () => {
  const subtitle = 'Active Plans';

  const options: ToggleOption[] = [
    { key: 'monthly', label: 'Monthly' },
    {
      key: 'yearly',
      label: (
        <>
          Yearly{' '}
          <span className="text-[16px] leading-6.5 font-medium">(10% off)</span>
        </>
      ),
    },
  ];

  const [selected, setSelected] = useState('yearly');

  const handleClick = (key: string) => {
    setSelected(key);
  };

  return (
    <>
      <div className="flex items-center justify-between pt-6">
        <p className="text-brand-dark text-xl leading-7.5 font-semibold">
          {subtitle}
        </p>
        <div className="border-grey-light flex rounded-full border p-1">
          {options.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleClick(key)}
              className={`min-h-10 min-w-32 rounded-full px-2 text-lg font-semibold whitespace-nowrap transition ${
                selected === key
                  ? 'bg-brand-primary text-white'
                  : 'text-theme-text-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {selected === 'yearly' ? <YearlyPlans /> : <MonthlyPlans />}
    </>
  );
};

export default ActivePlansComponent;
