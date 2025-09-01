import React from 'react';
import Label from '@/components/common/hook-form/Label';
import { Controller, Control } from 'react-hook-form';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from '@/components/ui/select';
import { AddorEditFormValues } from '../types';

type Team = {
  id: number;
  name: string;
};

type TeamFieldProps = {
  control: Control<AddorEditFormValues>;
  teamsData: Team[]; // Team should be defined in types.ts
  setOpenInviteMember: React.Dispatch<React.SetStateAction<boolean>>;
};

const TeamField: React.FC<TeamFieldProps> = ({
  control,
  teamsData,
  setOpenInviteMember,
}) => {
  return (
    <div className="col-span-full">
      <Label
        className="text-base leading-[26px] font-medium"
        htmlFor="team"
        required
      >
        Team
      </Label>
      <Controller
        name="team"
        control={control}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) => {
              if (value === 'add_team') {
                setOpenInviteMember(true);
                field.onChange('');
              } else {
                field.onChange(value);
              }
            }}
          >
            <SelectTrigger className="border-gray-light font-outfit w-full rounded-md border text-xs leading-[21px] font-normal !text-black">
              <SelectValue className="" placeholder="Select Team" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* teamsData?.data?.map((teamsDataItems: any) => ({ */}
                {teamsData?.map((team: Team) => (
                  <SelectItem key={team.id} value={team.name}>
                    <span className="font-outfit rounded-md px-3 py-1 text-sm leading-[16px] font-medium">
                      {team.name}
                    </span>
                  </SelectItem>
                ))}
                <SelectItem value="add_team" className="bg-brand-primary">
                  <span className="font-outfit rounded-md px-3 py-1 text-sm leading-[16px] font-medium">
                    Add Team
                  </span>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};

export default TeamField;
