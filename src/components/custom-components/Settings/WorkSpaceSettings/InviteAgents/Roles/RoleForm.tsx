'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/common/hook-form/InputField';
import Label from '@/components/common/hook-form/Label';
import { SelectField } from '@/components/common/hook-form/SelectField';
import { Form } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ReuseableTable } from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/ReuseableTable';
import { DialogClose } from '@/components/ui/dialog'; // to close dialog on cancel
import { useMutation, useQuery } from '@tanstack/react-query';
import { RolesService } from '@/services/staffmanagment/roles/roles.service';
import { useCreateRole } from '@/hooks/staffmanagment/roles/useCreateRoles';
import { useGetAllPermissionGroup } from '@/hooks/staffmanagment/roles/useGetAllPermissionGroup';
import { useUpdateRoles } from '@/hooks/staffmanagment/roles/useUpdateRoles';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { RoleSchema } from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Roles/RoleSchema';

type PermissionState = {
  permission_id: number;
  is_changeable: boolean;
  is_viewable: boolean;
  is_deletable: boolean;
};

type GroupPermissions = Record<string, { id: number; name: string }[]>;

type FormValues = {
  name: string;
  id?: number;
  role_id?: string;
  permissions?: PermissionState[];
  groups?: GroupPermissions;
};

interface RoleFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: FormValues) => void;
  roleHead: string;
  is_changeable?: boolean;
  is_viewable?: boolean;
  is_deletable?: boolean;
}

type OrderRow = {
  permissions: string;
  id?: number;
  is_changeable?: boolean;
  is_viewable?: boolean;
  is_deletable?: boolean;
};

type Column<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

const RoleForm: React.FC<RoleFormProps> = ({
  defaultValues,
  onSubmit,
  roleHead,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(RoleSchema),
    defaultValues: defaultValues || {
      name: '',
    },
  });

  // create role
  const { mutate: createRole, isPending, isSuccess } = useCreateRole();

  //get all permissions
  const { data, error, isLoading } = useGetAllPermissionGroup();

  //Edit Role
  const {
    mutate: updateRole,
    isPending: updateRolePending,
    isSuccess: updateRoleSuccess,
  } = useUpdateRoles();

  const [selectedTab, setSelectedTab] = useState('setting');

  const orders: OrderRow[] = React.useMemo(() => {
    const tabData =
      data?.[selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)] || [];
    return tabData.map((perm: any) => ({
      permissions: perm.name,
      id: perm.id,
    }));
  }, [data, selectedTab]);

  const [permissionsState, setPermissionsState] = React.useState<
    {
      permission_id: number;
      is_changeable: boolean;
      is_viewable: boolean;
      is_deletable: boolean;
    }[]
  >([]);

  React.useEffect(() => {
    if (orders.length === 0) return;

    // Step 1: Start from current orders (only one per permission_id)
    let mergedPermissions = orders.map((order) => ({
      permission_id: order.id || 0,
      is_changeable: order.is_changeable || false,
      is_viewable: order.is_viewable || false,
      is_deletable: order.is_deletable || false,
    }));

    // Step 2: If editing, merge in saved values
    if (defaultValues?.permissions?.length) {
      mergedPermissions = mergedPermissions.map((perm) => {
        const match = defaultValues.permissions!.find(
          (p) => p.permission_id === perm.permission_id,
        );
        return match ? { ...perm, ...match } : perm;
      });
    }

    // Step 3: Set state (ensuring unique permission IDs)
    setPermissionsState((prev) => {
      const all = [
        ...prev.filter(
          (p) =>
            !mergedPermissions.some(
              (mp) => mp.permission_id === p.permission_id,
            ),
        ),
        ...mergedPermissions,
      ];

      // Ensure uniqueness
      return all.filter(
        (p, idx, arr) =>
          arr.findIndex((x) => x.permission_id === p.permission_id) === idx,
      );
    });
  }, [orders, defaultValues]);

  const handleSubmit = (formData: FormValues) => {
    // Check if every permission has at least one permission selected
    const isAllPermissionsValid = permissionsState.some(
      ({ is_changeable, is_viewable, is_deletable }) =>
        is_changeable || is_viewable || is_deletable,
    );

    if (!isAllPermissionsValid) {
      console.log(
        'Please select at least one permission (view/edit/delete) for each permission.',
      );
      return; // Stop submission
    }

    const payload = {
      name: formData.name,
      description: '',
      permission_group: '1',
      permissions: permissionsState.map(
        ({ permission_id, is_changeable, is_viewable, is_deletable }) => ({
          permission_id,
          is_changeable,
          is_viewable,
          is_deletable,
        }),
      ),
    };

    if (defaultValues?.role_id || defaultValues?.id) {
      // Editing an existing role
      updateRole(
        { role_id: defaultValues.role_id, payload },
        {
          onSuccess: (response) => {
            console.log('Role updated successfully:', response);
          },
          onError: (error) => {
            console.error('Error updating role:', error);
          },
        },
      );
    } else {
      // Creating a new role
      createRole(payload, {
        onSuccess: (response) => {
          console.log('Create role response:', response);
        },
        onError: (error) => {
          console.error('Create role error:', error);
        },
      });
    }
    console.log('defaultValues', payload);
    return;
  };

  const columns: Column<OrderRow>[] = [
    {
      key: 'permissions',
      label: 'Permissions',
    },
    {
      key: 'edit',
      label: 'Able to edit',
      render: (row) => {
        const rowIndex = orders.findIndex((o) => o.id === row.id);
        return (
          <Checkbox
            checked={permissionsState[rowIndex]?.is_changeable}
            onCheckedChange={(checked) => {
              const updated = [...permissionsState];
              updated[rowIndex].is_changeable = checked === true;
              setPermissionsState(updated);
            }}
            aria-label={`Edit ${row.permissions}`}
            className="data-[state=checked]:bg-brand-primary bg-gray-primary border-gray-300"
          />
        );
      },
    },
    {
      key: 'view',
      label: 'Able to view',
      render: (row) => {
        const rowIndex = orders.findIndex(
          (o) => o.permissions === row.permissions,
        );

        return (
          <Checkbox
            checked={permissionsState[rowIndex]?.is_viewable}
            onCheckedChange={(checked) => {
              const updated = [...permissionsState];
              updated[rowIndex].is_viewable = checked === true;
              setPermissionsState(updated);
            }}
            aria-label={`View ${row.permissions}`}
            className="data-[state=checked]:bg-brand-primary bg-gray-primary border-gray-300"
          />
        );
      },
    },
    {
      key: 'delete',
      label: 'Able to delete',
      render: (row) => {
        const rowIndex = orders.findIndex(
          (o) => o.permissions === row.permissions,
        );

        return (
          <Checkbox
            checked={permissionsState[rowIndex]?.is_deletable}
            onCheckedChange={(checked) => {
              const updated = [...permissionsState];
              updated[rowIndex].is_deletable = checked === true;
              setPermissionsState(updated);
            }}
            aria-label={`Delete ${row.permissions}`}
            className="data-[state=checked]:bg-brand-primary bg-gray-primary border-gray-300"
          />
        );
      },
    },
  ];

  return (
    <Card className="w-full max-w-full border-0 py-0 shadow-none">
      <CardHeader className="p-0">
        <CardTitle className="text-lg leading-[29px] font-semibold">
          {roleHead}
        </CardTitle>
        <CardDescription className="text-xs leading-[17px] font-normal">
          Modify an existing role’s name, permissions, or access levels to keep
          your team structure up to date.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {/* Role Input */}
            <div className="pb-[49px]">
              <InputField
                label="Role Name"
                name="name"
                placeholder="Moderator"
                labelClassName="text-sm"
                control={form.control}
                required
              />
            </div>

            {/* Permissions Section */}
            <div className="flex h-full w-full gap-5">
              {/* Tabs */}
              <div className="h-auto w-auto">
                <Tabs
                  defaultValue="setting"
                  value={selectedTab}
                  onValueChange={setSelectedTab}
                  className="flex w-full flex-col gap-[12px]"
                >
                  <div className="border-brand-dark flex h-[201px] flex-col items-start border-r-4 pr-6 pb-3">
                    <p className="text-sm leading-[21px] font-semibold">
                      Set Permission
                    </p>
                    {data &&
                      Object.entries(data).map(([groupName, permissions]) => (
                        <>
                          <TabsList className="flex h-[201px] flex-col items-start bg-transparent">
                            <TabsTrigger
                              value={groupName}
                              className="data-[state=active]:text-brand-primary p-0 text-sm leading-[21px] font-normal !shadow-none"
                            >
                              {groupName}
                            </TabsTrigger>
                          </TabsList>
                        </>
                      ))}
                  </div>
                </Tabs>
              </div>

              {/* Permissions Table */}
              <ReuseableTable
                columns={columns}
                data={orders}
                tableClassName="bg-white border-b-0 border-none"
                headerClassName="border-none"
              />
            </div>

            {/* Footer Buttons */}
            <CardFooter className="flex justify-end gap-4 px-0 pt-6">
              <DialogClose asChild>
                <Button
                  className="bg-brand-primary h-[36px] w-full max-w-[130px] rounded-lg px-4 py-2.5 text-xs leading-4 font-semibold text-white"
                  variant="outline"
                  type="button"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                className="bg-brand-primary h-[36px] w-full max-w-[130px] rounded-lg px-4 py-3 text-xs leading-4 font-semibold text-white"
                type="submit"
              >
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RoleForm;
