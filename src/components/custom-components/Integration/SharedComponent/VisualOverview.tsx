import { Icons } from '@/components/ui/Icons';
import React from 'react';
import { VisualOverviewProps } from './types';

const VisualOverview: React.FC<VisualOverviewProps> = ({
  headingIcon: HeadingIcon = Icons.ri_pie_chart_2_fill,
  headingText = 'How Zipper flow works: A Visual Overview',
  subText = 'Zippy AI automates your customer support with intuitive, customizable workflows. Here’s a simplified example.',
  steps = [],
}) => {
  return (
    <div>
      <div className="mb-10">
        <div className="mb-1 flex items-center gap-2">
          <HeadingIcon className="text-brand-primary h-4 w-4" />
          <p className="text-brand-dark text-xl font-semibold">{headingText}</p>
        </div>
        <p className="text-sm font-normal">{subText}</p>
      </div>

      {steps.map((step, index) => (
        <div key={index}>
          <div className="mb-4.5 flex justify-center">
            <div
              className={`${step.borderClass} border-info bg-info-light flex w-[325px] flex-col items-center rounded-lg border-l-4 py-2.5`}
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
