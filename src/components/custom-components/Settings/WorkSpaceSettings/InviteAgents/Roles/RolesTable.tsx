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
  // toggle modal
  const [open, setOpen] = useState(false);
  const [openRole, setOpenRole] = useState(false);
  const [openCreateRole, setOpenCreateRole] = useState(false);

  const orders: OrderRow[] = [
    {
      RoleName: 'Agent',
      agents: 12,
      permission: 'Permission 1, Permission 2, Permission 3',
      date: '23, June, 2025',
      Actions: '',
    },
    {
      RoleName: 'Admin',
      agents: 7,
      permission: 'Permission 1, Permission 2, Permission 3',
      date: '06, August, 2025',
      Actions: '',
    },
  ];

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
            <div>
              <div
                className="h-full max-h-[36px] w-auto rounded text-xs leading-4 font-semibold"
                onClick={() => setOpenRole(true)}
              >
                <Icons.ri_edit2_fill className="text-black" />
                {/* <Icons.ri_edit2_fill /> */}
              </div>

              <AgentInviteModal
                open={openRole}
                onOpenChange={setOpenRole}
                dialogClass="!max-w-[676px] px-5 py-10 gap-0"
              >
                <RoleForm
                  defaultValues={{}}
                  onSubmit={(data) => console.log('Edited role:', data)}
                  roleHead="Edit Role"
                />
              </AgentInviteModal>
            </div>
            {/* // delete role */}
            <div>
              <div
                className="h-full max-h-[36px] w-auto rounded text-xs leading-4 font-semibold"
                onClick={() => setOpen(true)}
              >
                <Icons.ri_delete_bin_5_line className="text-red-500" />
                {/* <Icons.ri_edit2_fill /> */}
              </div>
              <DeleteModal
                open={open}
                onOpenChange={setOpen}
                title="Delete Member "
                description="Delete this team and revoke member access. All related settings will be lost. Confirm before proceeding."
                confirmText="Confirm & Delete"
                onCancel={() => {}}
                onConfirm={() => {}}
              >
                {/* <DeleteModal /> */}
              </DeleteModal>
            </div>
          </div>
        );
      },
    },
  ];

  return (
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
              console.log('New role created:', data);
            }}
            roleHead="Create Role"
          />
        </AgentInviteModal>
      </div>

      {/* Table */}
      <ReuseableTable columns={columns} data={orders} />
    </div>
  );
};

export default RolesTable;
