import React from 'react';
import Label from '@/components/common/hook-form/Label';
import { Controller } from 'react-hook-form';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { FieldProps } from '../types';

const ShiftField: React.FC<FieldProps> = ({ control }) => {
  return (
    <div>
      <Label
        className="text-base leading-[26px] font-medium"
        htmlFor="day"
        required
      >
        Shift
      </Label>
      <Controller
        name="shift"
        control={control}
        render={({ field, fieldState }) => {
          return (
            <>
              <ToggleGroup
                type="single"
                className="border-grey-light flex w-full gap-7 border px-[13px] py-1"
                value={field.value}
                onValueChange={field.onChange}
              >
                <ToggleGroupItem
                  className="data-[state=on]:bg-brand-primary data-[state=on]:hover:bg-brand-primary rounded-[4px] px-[15px] py-[2px] text-xs leading-[21px] font-normal data-[state=on]:border data-[state=on]:text-white"
                  value="morning"
                >
                  Morning
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="data-[state=on]:bg-brand-primary data-[state=on]:hover:bg-brand-primary rounded-[4px] px-[15px] py-[2px] data-[state=on]:border data-[state=on]:text-white"
                  value="day"
                >
                  Day
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="data-[state=on]:bg-brand-primary data-[state=on]:hover:bg-brand-primary rounded-[4px] px-[15px] py-[2px] data-[state=on]:border data-[state=on]:text-white"
                  value="night"
                >
                  Night
                </ToggleGroupItem>
              </ToggleGroup>
              {fieldState.error && (
                <p className="mt-1 text-xs text-red-500">
                  {fieldState.error.message}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
};

export default ShiftField;
