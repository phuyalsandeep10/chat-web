'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
// import AddAgentDialog from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AddAgentDialog';
import RoleForm from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Roles/RoleForm';
// import AddAgent from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AddAgent';
import { ReuseableTable } from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/ReuseableTable';
import DeleteModal from '@/components/modal/DeleteModal';
import AgentInviteModal from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AgentInviteModal';
import { useCreateRole } from '@/hooks/staffmanagment/roles/useCreateRoles';
import { useGetAllRolePermissionGroup } from '@/hooks/staffmanagment/roles/useGetAllRolePermissionGroup';
import { format } from 'date-fns';
import { useUpdateRoles } from '@/hooks/staffmanagment/roles/useUpdateRoles';
import { useDeleteRole } from '@/hooks/staffmanagment/roles/useDeleteRole';
import { useGetAllRolesPermissionsForEdit } from '@/hooks/staffmanagment/useGetAllRolesPermissionsForEdit';

export interface OrderRow {
  RoleName: string;
  agents: number;
  permission: string;
  date: string;
  Actions: string;
}

interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface RolesTableProps {
  handleOpenDialog: (options: {
    heading: string;
    subheading: string;
    onAction: () => void;
    headericon?: React.ReactNode;
  }) => void;
}

const RolesTable: React.FC<RolesTableProps> = ({ handleOpenDialog }) => {
  // create role
  const { mutate: createRole, isPending, isSuccess } = useCreateRole();
  const {
    data: roleTableData,
    isPending: roleDataPending,
    isSuccess: roleSuccess,
  } = useGetAllRolePermissionGroup();
  const { mutate: GetAllRolesPermissionsForEdit } =
    useGetAllRolesPermissionsForEdit();

  //update role
  const { mutate: updateRole } = useUpdateRoles();

  //delete role
  const {
    mutate: deleteRole,
    isPending: deletePending,
    isSuccess: deleteSuccess,
  } = useDeleteRole();

  // toggle modal
  const [open, setOpen] = useState(false);
  const [openRole, setOpenRole] = useState(false);
  const [openCreateRole, setOpenCreateRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  // New function to handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!selectedRole?.id) return;
    deleteRole(selectedRole.id, {
      onSuccess: () => {
        setOpen(false);
        setSelectedRole(null);
        // refetch roles here or trigger update UI logic
      },
      onError: (error) => {
        console.error('Failed to delete role:', error);
        // Optionally show error message/toast
      },
    });
  };

  // handle edit click
  const handleEditClick = (row: any) => {
    setOpenRole(true);
    GetAllRolesPermissionsForEdit(
      { role_id: row.id },
      {
        onSuccess: (res) => {
          const mappedPermissions = (res.role_permissions || []).map(
            (perm: any) => ({
              permission_id: perm.permission_id,
              is_changeable: perm.is_changeable ?? false,
              is_viewable: perm.is_viewable ?? false,
              is_deletable: perm.is_deletable ?? false,
            }),
          );

          setSelectedRole({
            id: row.id,
            RoleName: row.RoleName,
            permissions: mappedPermissions,
            groups: {
              Setting: res.Setting || [],
              Channels: res.Channels || [],
              'Inbox & Contact': res['Inbox & Contact'] || [],
              Analystics: res.Analystics || [],
              'Section Access': res['Section Access'] || [],
            },
          });
        },
      },
    );
  };

  const columns: Column<OrderRow>[] = [
    { key: 'RoleName', label: 'Role Name' },
    { key: 'agents', label: 'No. of Agents' },
    { key: 'permission', label: 'Permission Summary' },
    { key: 'date', label: 'Created Date' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => {
        return (
          <div className="flex gap-[10px]">
            {/* // edit role */}
            <div
              className="h-full max-h-[36px] w-auto rounded text-xs leading-4 font-semibold"
              onClick={() => handleEditClick(row)}
            >
              <Icons.ri_edit2_fill className="text-black" />
              {/* <Icons.ri_edit2_fill /> */}
            </div>
            {/* // delete role */}
            <div
              className="h-full max-h-[36px] w-auto rounded text-xs leading-4 font-semibold"
              onClick={() => {
                setSelectedRole(row); // <-- set the role here
                setOpen(true);
              }}
            >
              <Icons.ri_delete_bin_5_line className="text-alert-prominent" />
              {/* <Icons.ri_edit2_fill /> */}
            </div>
          </div>
        );
      },
    },
  ];

  // const orders: OrderRow[] = [
  //   {
  //     RoleName: 'Agent',
  //     agents: 12,
  //     permission: 'Permission 1, Permission 2, Permission 3',
  //     date: '23, June, 2025',
  //     Actions: '',
  //   },
  //   {
  //     RoleName: 'Admin',
  //     agents: 7,
  //     permission: 'Permission 1, Permission 2, Permission 3',
  //     date: '06, August, 2025',
  //     Actions: '',
  //   },
  // ];

  const orders: OrderRow[] = React.useMemo(() => {
    return (
      roleTableData?.data?.map((roleTableDataItems: any) => ({
        permissions: roleTableDataItems.permission_summary,
        id: roleTableDataItems.role_id,
        RoleName: roleTableDataItems.role_name,
        agents: roleTableDataItems.no_of_agents,
        permission: '',
        date: roleTableDataItems.created_at
          ? format(new Date(roleTableDataItems.created_at), 'dd MMMM yyyy')
          : 'N/A',
        Actions: '',
      })) || []
    );
  }, [roleTableData]);

  return (
    <>
      <div>
        {/* Header */}
        <div className="pb-6">
          <p className="text-brand-dark pb-1 text-sm leading-[21px] font-semibold">
            Workspace Roles
          </p>
          <span className="text-xs leading-[17px] font-normal">
            Customize roles to control what each team member can see and do.
          </span>
        </div>

        {/* Create Role Button */}
        <div className="flex justify-end gap-4 pb-4">
          <Button
            variant="outline"
            className="bg-brand-primary h-full max-h-[36px] rounded px-6 py-2.5 text-xs font-semibold text-white"
            onClick={() => setOpenCreateRole(true)}
          >
            <Icons.plus_circle />
            Create New Role
          </Button>
          <AgentInviteModal
            open={openCreateRole}
            onOpenChange={setOpenCreateRole}
            dialogClass="!max-w-[676px] px-5"
          >
            <RoleForm
              onSubmit={(data) => {
                createRole(data);
                // setOpenCreateRole(false);
              }}
              roleHead="Create Role"
              setOpenCreateRole={setOpenCreateRole}
            />
          </AgentInviteModal>
        </div>

        {/* Table */}
        <ReuseableTable columns={columns} data={orders} />
      </div>
      {/* Edit Role Modal in order */}
      <AgentInviteModal
        open={openRole}
        onOpenChange={setOpenRole}
        dialogClass="!max-w-[676px] px-5 py-10 gap-0"
      >
        {selectedRole && (
          <RoleForm
            defaultValues={{
              role_id: selectedRole.id,
              name: selectedRole.RoleName,
              permissions: selectedRole.permissions,
              groups: selectedRole.groups,
            }}
            onSubmit={(data) => {
              updateRole({ role_id: selectedRole.id, payload: data });
              setOpenRole(false);
              setSelectedRole(null);
            }}
            roleHead="Edit Role"
          />
        )}
      </AgentInviteModal>
      {/* Delete Role Confirmation Modal in order delete */}
      <DeleteModal
        open={open}
        onOpenChange={setOpen}
        title="Delete Member "
        description="Delete this team and revoke member access. All related settings will be lost. Confirm before proceeding."
        confirmText="Confirm & Delete"
        onCancel={() => {
          setOpen(false);
          setSelectedRole(null);
        }}
        onConfirm={handleDeleteConfirm}
      >
        {/* <DeleteModal /> */}
      </DeleteModal>
    </>
  );
};

export default RolesTable;
