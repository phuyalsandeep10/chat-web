import React, { useState, useEffect } from 'react';
import Label from '@/components/common/hook-form/Label';
import { InputField } from '@/components/common/hook-form/InputField';
import { Icons } from '@/components/ui/Icons';
import AgentInviteModal from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AgentInviteModal';
import TimePicker from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Invites/InviteClock';
import { Control } from 'react-hook-form';
import { AddorEditFormValues } from '../types';

type TimeType = {
  hours: number;
  minutes: number;
  period: 'AM' | 'PM';
};

type TimeFieldProps = {
  name: keyof AddorEditFormValues;
  label: string;
  placeholder?: string;
  control: Control<AddorEditFormValues>;
  onChange: (value: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  defaultValue?: string;
};

const TimeField: React.FC<TimeFieldProps> = ({
  name,
  label,
  placeholder,
  onChange,
  open,
  setOpen,
  control,
  defaultValue,
}) => {
  // Convert defaultValue "08:00 AM" → TimeType
  const parseTime = (val: string): TimeType => {
    const [time, period] = val.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    return { hours, minutes, period: period as 'AM' | 'PM' };
  };

  const [time, setTime] = useState<TimeType>(
    defaultValue
      ? parseTime(defaultValue)
      : { hours: 7, minutes: 0, period: 'AM' },
  );

  // Update react-hook-form when time changes
  useEffect(() => {
    const formatted = `${time.hours.toString().padStart(2, '0')}:${time.minutes
      .toString()
      .padStart(2, '0')} ${time.period}`;
    onChange(formatted);
  }, [time]);

  // Update time state when user types in input
  const handleInputChange = (val: string) => {
    const regex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
    const match = val.match(regex);
    if (match) {
      const hours = Math.min(12, Math.max(1, Number(match[1])));
      const minutes = Math.min(59, Math.max(0, Number(match[2])));
      const period = match[3].toUpperCase() as 'AM' | 'PM';
      setTime({ hours, minutes, period });
    }
  };

  // Input display value
  const inputValue: string = `${time.hours.toString().padStart(2, '0')}:${time.minutes
    .toString()
    .padStart(2, '0')} ${time.period}`;

  return (
    <div className="flex w-[100%] basis-full gap-[26px]">
      <div className="relative w-full">
        <InputField
          name={name}
          control={control}
          placeholder={placeholder}
          inputClassName="!text-xs leading-[21px] font-normal"
          labelClassName="text-base leading-[26px] font-medium"
          label={label}
          value={inputValue}
          onChange={handleInputChange}
          required
          readOnly
        />
        <div>
          <Icons.ri_time_line
            className="absolute top-[60%] right-2"
            onClick={() => setOpen(true)}
          />
          {/* add agennt button */}
          <AgentInviteModal
            open={open}
            onOpenChange={setOpen}
            dialogClass="gap-0 !max-w-[335px] !border-theme-text-light !w-full !rounded-[0.86px] !shadow-[0px_4.55px_4.55px_0px_#00000040] p-8"
          >
            <TimePicker
              onClose={() => setOpen(false)}
              setFieldValue={setTime}
              time={`${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')} ${time.period}`}
            />
          </AgentInviteModal>
        </div>
      </div>
    </div>
  );
};

export default TimeField;
