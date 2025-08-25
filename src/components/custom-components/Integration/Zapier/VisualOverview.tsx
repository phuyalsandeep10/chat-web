import { Icons } from '@/components/ui/Icons';
import React from 'react';

const steps = [
  {
    title: '1. Customer Initiates Chat',
    description: 'User types a question or request.',
    borderClass: 'border-info bg-info-light',
  },
  {
    title: '2. Analyzes Intent',
    description: 'Smartflow identifies the user’s need.',
    borderClass: 'border-success bg-prominent-success',
  },
  {
    title: '3. Condition logic applied.',
    description: 'If “billing inquiry” then ask for account details.',
    borderClass: 'border-info bg-info-light',
  },
  {
    title: '4. Resolution or handoff',
    description: 'User types a question or request.',
    borderClass: 'border-info bg-info-light',
  },
];

const VisualOverview = () => {
  return (
    <div>
      <div className="mb-10">
        <div className="mb-1 flex items-center gap-2">
          <Icons.ri_pie_chart_2_fill className="text-brand-primary h-4 w-4" />
          <p className="text-brand-dark text-xl font-semibold">
            How Zipper flow works: A Visual Overview
          </p>
        </div>
        <p className="text-sm font-normal">
          Zippy AI automates your customer support with intuitive, customizable
          workflows. Here’s a simplified example.
        </p>
      </div>

      {steps.map((step, index) => (
        <div key={index}>
          <div className="mb-4.5 flex justify-center">
            <div
              className={`${step.borderClass} flex w-[325px] flex-col items-center rounded-lg border-l-4 py-2.5`}
            >
              <p className="mb-1 text-center text-base font-medium">
                {step.title}
              </p>
              <p className="text-center text-xs font-normal">
                {step.description}
              </p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className="mb-4.5 flex justify-center">
              <Icons.arrow_down />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VisualOverview;
