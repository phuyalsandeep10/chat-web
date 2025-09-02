import React from 'react';
import Label from '@/components/common/hook-form/Label';
import { Controller } from 'react-hook-form';
import { Team, TeamFieldProps } from './types';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from '@/components/ui/select';

const TeamField: React.FC<TeamFieldProps> = ({
  control,
  teamsData,
  setOpenInviteMember,
}) => {
  const teamsArray = teamsData?.data || [];

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
                {teamsArray.map((team: Team) => (
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
