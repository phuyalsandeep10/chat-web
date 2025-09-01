import React from 'react';
import { Controller } from 'react-hook-form';
import { SelectField } from '@/components/common/hook-form/SelectField';
import { FieldProps } from '../types';

const RoleField: React.FC<FieldProps> = ({ control, roleTableData }) => {
  return (
    <div>
      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <SelectField
            {...field}
            required
            placeholder="Admin"
            className="font-outfit rounded-md p-0 py-1 text-sm leading-[16px] font-medium"
            placeholderClassName="font-outfit rounded-md text-xs leading-[21px] font-normal text-black"
            LabelClassName="text-base leading-[26px] font-medium"
            label="Role"
            isMulti={true}
            options={
              roleTableData?.data?.map((role: any) => ({
                value: role.role_name, // keep name
                label: role.role_name,
              })) || []
            }
          />
        )}
      />
    </div>
  );
};

export default RoleField;
