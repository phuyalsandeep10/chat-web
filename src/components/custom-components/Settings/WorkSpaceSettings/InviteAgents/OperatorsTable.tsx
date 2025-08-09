'use client';

import React, { useState } from 'react';
import { Icons } from '@/components/ui/Icons';
import AgentInviteModal from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AgentInviteModal';
// import { ReuseableTable } from './ReuseableTable';
import { AgenChatHistoryCard } from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AgenChatHistoryCard';
import DeleteModal from '@/components/modal/DeleteModal';
import AddOrEditAgentForm from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AddOrEditAgentForm';
import { ReuseableTable } from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/ReuseableTable';

export interface OrderRow {
  FullName: string;
  Roles: string;
  Shift: string;
  OperatingHours: string;
  Invitedon: string;
  Actions: string;
}

interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface OperatorsTableProps {
  handleOpenDialog: (props: {
    heading: string;
    subheading: string;
    onAction: () => void;
    headericon?: React.ReactNode;
  }) => void;
}

export default function OperatorsTable({
  handleOpenDialog,
}: OperatorsTableProps) {
  // states to toggle modal
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openTeamView, setOpenTeamView] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const orders: OrderRow[] = [
    {
      FullName: 'Yubesh Koirala',
      Roles: 'Admin',
      Shift: 'morning',
      OperatingHours: '9:00 - 17:00',
      Invitedon: '08/07/2025',
      Actions: '',
    },
    {
      FullName: 'Yubesh Koirala',
      Roles: 'Agent',
      Shift: 'Day',
      OperatingHours: '9:00 - 17:00',
      Invitedon: '08/07/2025',
      Actions: '',
    },
  ];

  const columns: Column<OrderRow>[] = [
    { key: 'FullName', label: 'Full Name' },
    {
      key: 'Roles',
      label: 'Roles',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.Roles.toLowerCase().includes('admin') ? (
            <Icons.ri_user_settings_fill />
          ) : (
            <Icons.ri_user_fill />
          )}
          <span>{row.Roles}</span>
        </div>
      ),
    },
    { key: 'Shift', label: 'Shift' },
    {
      key: 'OperatingHours',
      label: 'Operating Hours',
      render: (row) => {
        const isOperating = row.OperatingHours.trim() !== '';
        return (
          <div className="flex items-center gap-2">
            <span>{row.OperatingHours}</span>
            <span
              className={`h-2 w-2 rounded-full ${
                isOperating ? 'bg-[#009959]' : 'bg-[#F61818]'
              }`}
            />
          </div>
        );
      },
    },
    { key: 'Invitedon', label: 'Invited on' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {/* edit form */}
          <div className="flex gap-5">
            <div
              className="h-full max-h-[36px] w-auto rounded text-xs leading-4 font-semibold"
              onClick={() => setOpenEdit(true)}
            >
              <Icons.ri_edit2_fill className="text-black" />
            </div>
            {/* add agennt button */}
            <AgentInviteModal
              open={openEdit}
              onOpenChange={setOpenEdit}
              dialogTitle="Edit Information"
              dialogClass="!max-w-[768px]"
            >
              <AddOrEditAgentForm />
            </AgentInviteModal>
          </div>

          {/* view modal */}

          <div className="flex gap-5">
            <div
              className="h-full max-h-[36px] w-auto rounded text-xs leading-4 font-semibold"
              onClick={() => setOpenTeamView(true)}
            >
              <Icons.ri_eye_fill className="text-black" />
              {/* <Icons.ri_edit2_fill /> */}
            </div>
            {/* add agennt button */}
            <AgentInviteModal
              open={openTeamView}
              onOpenChange={setOpenTeamView}
              dialogClass="gap-0 !max-w-[554px]"
            >
              <AgenChatHistoryCard submitButton="Edit Agent" />
            </AgentInviteModal>
          </div>

          <div className="flex items-center gap-2">
            <Icons.ri_delete_bin_5_line
              className="text-red-500"
              onClick={() => setOpenDeleteModal(true)}
            />
          </div>
          <DeleteModal
            open={openDeleteModal}
            onOpenChange={setOpenDeleteModal}
            title="Delete Agent "
            description="This action will delete agent , you can temporarily suspend agent which wont delete his/her data."
            confirmText="Confirm & Delete"
            onCancel={() => {}}
            onConfirm={() => {}}
          ></DeleteModal>
        </div>
      ),
    },
  ];

  return <ReuseableTable columns={columns} data={orders} />;
}
