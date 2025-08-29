'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@radix-ui/react-label';
import clsx from 'clsx';
import { CheckboxAgreementProps } from './types';
import ErrorText from '@/components/common/hook-form/ErrorText';

const CheckboxAgreement: React.FC<CheckboxAgreementProps> = ({
  id = 'checkbox-agreement',
  label,
  checked,
  onChange,
  error,
  className = '',
}) => {
  return (
    <div className={clsx('mt-2 space-y-1', className)}>
      <div className="flex items-center space-x-5">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(value) => onChange(!!value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={clsx(
            'h-4.5 w-4.5 rounded-full border transition-colors',
            checked
              ? 'data-[state=checked]:bg-black data-[state=checked]:text-white'
              : 'border-gray-light bg-white',
          )}
        />
        <Label
          className="text-theme-text-primary text-[16px] font-normal"
          htmlFor={id}
        >
          {label}
        </Label>
      </div>

      {error && <ErrorText error={error} />}
    </div>
  );
};

export default CheckboxAgreement;
