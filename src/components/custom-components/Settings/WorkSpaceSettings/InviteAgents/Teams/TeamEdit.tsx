import React, { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { InputField } from '@/components/common/hook-form/InputField';
import Label from '@/components/common/hook-form/Label';
import { Form } from '@/components/ui/form';
import { Icons } from '@/components/ui/Icons';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type FormValues = {
  teamname: string;
  member?: string;
};

interface TeamEditProps {
  defaultValues?: () => void;
  onSubmit: () => void;
}

const TeamEdit: React.FC<TeamEditProps> = ({
  defaultValues = {},
  onSubmit,
}) => {
  const form = useForm<FormValues>({
    defaultValues: {
      teamname: 'lead',
      ...defaultValues,
    },
  });

  // Track if member is selected or not
  const [hasSelectedMemberRole, setHasSelectedMemberRole] = useState(
    !!form.getValues('member'),
  );

  return (
    <Card className="w-full max-w-full border-0 p-0 shadow-none">
      {/* ... CardHeader and other form code above ... */}

      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Team Name Input */}
            {/* ... */}

            {/* Member Role ToggleGroup with initial bg-primary before select */}
            <div className="pb-5">
              <Label
                required
                htmlFor="member"
                className="pb-3 text-base leading-[26px] font-medium"
              >
                Team Member
              </Label>

              <Controller
                name="member"
                control={form.control}
                render={({ field }) => {
                  const hasSelected = !!field.value;

                  const onValueChange = (value: string) => {
                    field.onChange(value);
                  };

                  return (
                    <div className="border-grey-light rounded-sm border">
                      <div className="flex items-center justify-between rounded-sm px-5 py-[18px]">
                        <span>Frank Lampard</span>
                        <div className="flex items-center gap-3.5">
                          <ToggleGroup
                            type="single"
                            className="bg-brand-disable flex gap-7 px-[13px] py-1"
                            value={field.value || ''}
                            onValueChange={onValueChange}
                          >
                            {['Lead', 'Admin', 'Moderator', 'Agent'].map(
                              (role) => (
                                <ToggleGroupItem
                                  key={role}
                                  value={role}
                                  className={`rounded-[4px] px-[15px] py-[2px] data-[state=on]:border data-[state=on]:text-white ${
                                    hasSelected
                                      ? 'data-[state=on]:bg-brand-primary data-[state=on]:hover:bg-brand-primary'
                                      : role === 'Lead'
                                        ? 'bg-brand-primary text-white'
                                        : ''
                                  }`}
                                >
                                  {role}
                                </ToggleGroupItem>
                              ),
                            )}
                          </ToggleGroup>
                          <Icons.ri_delete_bin_5_line className="text-alert-prominent cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            </div>

            {/* Add Member button */}
            <Button
              type="submit"
              className="bg-brand-disable text-brand-primary hover:bg-brand-disable h-full max-h-[36px] w-full rounded-sm px-[22px] py-3 text-xs leading-4 font-semibold"
            >
              <Icons.plus />
              Add Member
            </Button>
          </form>
        </Form>
      </CardContent>

      {/* Save Change button */}
      <CardFooter className="flex justify-end gap-4 p-0">
        <Button
          type="button"
          className="h-full max-h-[36px] w-auto rounded-lg px-[22px] py-3 text-xs leading-4 font-semibold"
          onClick={form.handleSubmit(onSubmit)}
        >
          Save Change
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeamEdit;
