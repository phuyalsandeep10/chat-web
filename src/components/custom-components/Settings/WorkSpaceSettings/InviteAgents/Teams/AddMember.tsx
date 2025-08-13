import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/common/hook-form/InputField';
import Label from '@/components/common/hook-form/Label';
import { SelectField } from '@/components/common/hook-form/SelectField';
import { Form } from '@/components/ui/form';
import { useGetAllRolePermissionGroup } from '@/hooks/staffmanagment/roles/useGetAllRolePermissionGroup';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type FormValues = {
  email: string;
  fullName: string;
  role: string;
};

// added role permission
type RolePermission = {
  role_id: any;
  role_name: any;
};

interface AddMemberProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: any) => void;
}

const AddMember: React.FC<AddMemberProps> = ({
  defaultValues = {},
  onSubmit,
}) => {
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      fullName: '',
      role: '',
      ...defaultValues,
    },
  });

  // get team members
  const {
    data: roleTableData,
    isPending: roleDataPending,
    isSuccess: roleSuccess,
  } = useGetAllRolePermissionGroup();

  return (
    <Card className="w-full max-w-full border-0 p-0 shadow-none">
      <CardHeader className="inline-flex items-center gap-x-[17px] gap-y-[14px] px-0">
        <div className="flex w-full justify-between">
          <div>
            <CardTitle className="text-lg leading-[29px] font-semibold">
              Invite New Member
            </CardTitle>
            <CardDescription className="text-xs leading-[17px] font-normal">
              Send an invitation to a new member to join your team.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Email Field */}
              <div>
                <Label
                  required
                  htmlFor="email"
                  className="pb-3 text-base leading-[26px] font-medium"
                >
                  Enter agent’s Email
                </Label>
                <InputField name="email" control={form.control} />
              </div>

              {/* Full Name Field */}
              <div>
                <Label
                  required
                  htmlFor="fullName"
                  className="pb-3 text-base leading-[26px] font-medium"
                >
                  Full Name
                </Label>
                <InputField name="fullName" control={form.control} />
              </div>

              {/* Role Select Field */}
              <div className="col-span-full">
                <Label
                  required
                  htmlFor="role"
                  className="pb-3 text-base leading-[26px] font-medium"
                >
                  Role
                </Label>
                <SelectField
                  name="role"
                  control={form.control}
                  placeholder="Select Role"
                  options={
                    Array.isArray(roleTableData?.data)
                      ? roleTableData.data.map((item) => {
                          return {
                            value: item.role_id.toString(),
                            label: item.role_name,
                          };
                        })
                      : []
                  }
                />
              </div>
            </div>

            <CardFooter className="px-0">
              <Button
                type="submit"
                className="bg-brand-primary col-span-full mt-4 h-[36px] w-full rounded-lg px-[22px] py-2.5 text-xs leading-4 font-semibold text-white"
              >
                Send Invitation
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddMember;
