import React from 'react';
import { Controller } from 'react-hook-form';
import { SelectField } from '@/components/common/hook-form/SelectField';
import { FieldProps } from '../types';

interface ClientFieldProps extends FieldProps {
  errorMessage?: string;
}

const ClientField: React.FC<FieldProps> = ({ control }) => {
  return (
    <div>
      <Controller
        name="clientHandled"
        control={control}
        render={({ field }) => (
          <SelectField
            name="clientHandled"
            control={control}
            required
            LabelClassName="pb-3 text-base leading-[26px] font-medium"
            label="Client Handled"
            // placeholder="select values"
            placeholderClassName="font-outfit rounded-md text-xs leading-[21px] font-normal text-black"
            options={[
              // { value: '', label: 'Select Clients' },
              { value: '0-6', label: '0-6' },
              { value: '7-20', label: '7-20' },
              { value: '21-50', label: '21-50' },
              { value: '50-120', label: '50-120' },
              { value: '120-200', label: '120-200' },
            ]}
            className="font-outfit inline-block rounded-md py-1 text-sm leading-[16px] font-medium"
          />
        )}
      />
    </div>
  );
};

export default ClientField;
