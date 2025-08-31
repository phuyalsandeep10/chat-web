import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/common/hook-form/InputField';
import Label from '@/components/common/hook-form/Label';
import { Form } from '@/components/ui/form';
import { useCreateTeams } from '@/hooks/staffmanagment/teams/useCreateTeams';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreateTeamFormValues, CreateTeamProps } from './types';

const CreateTeam: React.FC<CreateTeamProps> = ({
  defaultValues = {},
  onSubmit,
  onCancel,
}) => {
  const form = useForm<CreateTeamFormValues>({
    defaultValues: {
      newteam: '',
      ...defaultValues,
    },
  });
  return (
    <Card className="w-full max-w-full border-0 p-0 px-5 shadow-none">
      <CardHeader className="inline-flex flex-col gap-1 p-0">
        <CardTitle className="text-brand-dark text-xl leading-[30px] font-semibold">
          Create New Team
        </CardTitle>
        <CardDescription className="text-xs leading-[17px] font-normal">
          Add a new team and assign members.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {' '}
            <div>
              <InputField
                className="w-full"
                name="newteam"
                control={form.control}
                label="Enter new team"
                labelClassName="pb-3 text-base leading-[26px] font-medium"
                required
              />
            </div>
            <CardFooter className="mt-4 flex justify-end gap-4 p-0">
              <Button
                // className="basis-1/3 rounded-lg py-3"
                className="bg-brand-primary h-[36px] w-full max-w-[130px] rounded-lg px-[22px] py-2.5 text-xs leading-4 font-semibold text-white"
                variant="outline"
                type="button"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-brand-primary h-[36px] w-full max-w-[130px] rounded-lg px-[22px] py-2.5 text-xs leading-4 font-semibold text-white"
                // className="basis-1/3 rounded-lg py-3"
              >
                Continue
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateTeam;
