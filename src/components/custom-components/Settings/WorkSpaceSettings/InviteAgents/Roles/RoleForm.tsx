'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/common/hook-form/InputField';
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
import { DialogClose } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { RoleSchema } from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Roles/RoleSchema';
import { useGetAllPermissionGroup } from '@/hooks/staffmanagment/roles/useGetAllPermissionGroup';
import { toast } from 'sonner';
import {
  PermissionState,
  RoleFormValues,
  RoleFormProps,
  RoleOrderRow,
  RoleColumn,
} from './types';

const RoleForm: React.FC<RoleFormProps> = ({
  defaultValues,
  onSubmit,
  roleHead,
  setOpenCreateRole,
}) => {
  const isEdit = !!defaultValues?.id;

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(RoleSchema),
    defaultValues: defaultValues || { name: '' },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: defaultValues.name || '',
      });
    }
  }, [defaultValues, form]);

  const { data } = useGetAllPermissionGroup();

  const [changeableIds, setChangeableIds] = React.useState<Set<number>>(
    new Set(),
  );
  const [selectedTab, setSelectedTab] = useState('setting');

  const orders: RoleOrderRow[] = React.useMemo(() => {
    const tabData =
      (data as any)?.[
        selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)
      ] || [];
    return tabData.map((perm: any) => ({
      permissions: perm.name,
      id: perm.id,
      is_changeable: perm.is_changeable,
      is_viewable: perm.is_viewable,
      is_deletable: perm.is_deletable,
    }));
  }, [data, selectedTab]);

  const [permissionsState, setPermissionsState] = React.useState<
    PermissionState[]
  >([]);

  const pushPermissionId = (permission_id: number) => {
    setChangeableIds((prev) => new Set(prev).add(permission_id));
  };

  React.useEffect(() => {
    if (orders.length === 0) return;

    let mergedPermissions: PermissionState[] = orders.map((order) => ({
      permission_id: order.id || 0,
      is_changeable: order.is_changeable || false,
      is_viewable: order.is_viewable || false,
      is_deletable: order.is_deletable || false,
    }));

    if (defaultValues?.permissions?.length) {
      mergedPermissions = mergedPermissions.map((perm) => {
        const match = defaultValues.permissions!.find(
          (p) => p.permission_id === perm.permission_id,
        );
        return match ? { ...perm, ...match } : perm;
      });
    }

    setPermissionsState(mergedPermissions);
  }, [orders, defaultValues]);

  const handleSubmit = (formData: RoleFormValues) => {
    // const permissions = permissionsState.filter((p) =>
    //   changeableIds.has(p.permission_id),
    // );

    const permissions = permissionsState;

    if (!isEdit && permissions.length === 0) {
      toast.error('Please select at least one permission.');
      return;
    }

    const isAllPermissionsValid = permissionsState.some(
      ({ is_changeable, is_viewable, is_deletable }) =>
        is_changeable || is_viewable || is_deletable,
    );

    // check if used or not
    if (!isAllPermissionsValid) {
      toast.error('Please select at least one permission from each table');
      return;
    }

    const payload = {
      id: defaultValues?.id,
      name: formData.name,
      description: '',
      permission_group: 1,
      permissions: permissions,
    };

    onSubmit(payload);

    // prevent modal from closing without selecting one permission
    if (isAllPermissionsValid) setOpenCreateRole?.(false);
  };

  const columns: RoleColumn<RoleOrderRow>[] = [
    {
      key: 'permissions',
      label: 'Permissions',
    },
    {
      key: 'edit',
      label: 'Able to edit',
      render: (row) => (
        <Checkbox
          checked={
            permissionsState.find((p) => p.permission_id === row.id)
              ?.is_changeable || false
          }
          onCheckedChange={(checked) => {
            pushPermissionId(row.id!);
            setPermissionsState((prev) =>
              prev.map((p) =>
                p.permission_id === row.id
                  ? { ...p, is_changeable: checked === true }
                  : p,
              ),
            );
          }}
          aria-label={`Edit ${row.permissions}`}
          className="data-[state=checked]:bg-brand-primary bg-gray-primary border-gray-300"
        />
      ),
    },
    {
      key: 'view',
      label: 'Able to view',
      render: (row) => (
        <Checkbox
          checked={
            permissionsState.find((p) => p.permission_id === row.id)
              ?.is_viewable || false
          }
          onCheckedChange={(checked) => {
            setPermissionsState((prev) =>
              prev.map((p) =>
                p.permission_id === row.id
                  ? { ...p, is_viewable: checked === true }
                  : p,
              ),
            );
          }}
          aria-label={`View ${row.permissions}`}
          className="data-[state=checked]:bg-brand-primary bg-gray-primary border-gray-300"
        />
      ),
    },
    {
      key: 'delete',
      label: 'Able to delete',
      render: (row) => (
        <Checkbox
          checked={
            permissionsState.find((p) => p.permission_id === row.id)
              ?.is_deletable || false
          }
          onCheckedChange={(checked) => {
            setPermissionsState((prev) =>
              prev.map((p) =>
                p.permission_id === row.id
                  ? { ...p, is_deletable: checked === true }
                  : p,
              ),
            );
          }}
          aria-label={`Delete ${row.permissions}`}
          className="data-[state=checked]:bg-brand-primary bg-gray-primary border-gray-300"
        />
      ),
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
            <div className="pb-[49px]">
              <InputField
                name="name"
                placeholder="Moderator"
                control={form.control}
                label="Role Name"
                labelClassName="text-sm"
                required
              />
            </div>

            <div className="flex h-full w-full gap-5">
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
                      Object.entries(data).map(([groupName]) => (
                        <TabsList
                          key={groupName}
                          className="flex h-[201px] flex-col items-start bg-transparent"
                        >
                          <TabsTrigger
                            value={groupName}
                            className="data-[state=active]:text-brand-primary p-0 text-sm leading-[21px] font-normal !shadow-none"
                          >
                            {groupName}
                          </TabsTrigger>
                        </TabsList>
                      ))}
                  </div>
                </Tabs>
              </div>

              <ReuseableTable
                columns={columns}
                data={orders}
                tableClassName="bg-white border-b-0 border-none"
                headerClassName="border-none"
              />
            </div>

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
                Save
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RoleForm;
