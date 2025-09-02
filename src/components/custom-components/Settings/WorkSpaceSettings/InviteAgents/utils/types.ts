import { AddorEditFormValues } from '../types';
import { Control } from 'react-hook-form';

export type Team = {
  id: number;
  name: string;
};

export type TeamFieldProps = {
  control: Control<AddorEditFormValues>;
  teamsData: { data: Team[] } | undefined;
  setOpenInviteMember: React.Dispatch<React.SetStateAction<boolean>>;
};

// TIME FIELD PROPS

export type TimeType = {
  hours: number;
  minutes: number;
  period: 'AM' | 'PM';
};

export type TimeFieldProps = {
  name: keyof AddorEditFormValues;
  label: string;
  placeholder?: string;
  control: Control<AddorEditFormValues>;
  onChange: (value: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  defaultValue?: string;
};
