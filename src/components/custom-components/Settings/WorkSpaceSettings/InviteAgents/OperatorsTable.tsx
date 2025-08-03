'use client';

import React, { useState } from 'react';
import { Icons } from '@/components/ui/Icons';
import ReusableDialog from './ReusableDialog';
import AddAgent from './AddAgent';
import { ReuseableTable } from './ReuseableTable';
import { AgenChatHistoryCard } from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AgenChatHistoryCard';
import DeleteModal from '@/components/modal/DeleteModal';

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
  const [open, setOpen] = useState(false);

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
          <ReusableDialog
            trigger={
              <button aria-label="Edit agent">
                <Icons.ri_edit2_fill className="text-black" />
              </button>
            }
            dialogTitle="Edit Information"
            dialogClass="!max-w-[768px] "
          >
            <AddAgent
              defaultValues={{}}
              onSubmit={(data) => {
                console.log('Submitted', data);
              }}
              submitButton="Edit Agent"
            />
          </ReusableDialog>

          {/* view agent chat */}
          <ReusableDialog
            trigger={
              <button aria-label="View agent">
                <Icons.ri_eye_fill />
              </button>
            }
            dialogClass="gap-0 !max-w-[554px]"
          >
            <AgenChatHistoryCard submitButton="Edit Agent" />
          </ReusableDialog>

          <DeleteModal
            open={open}
            onOpenChange={setOpen}
            trigger={
              <div className="flex items-center gap-2">
                <Icons.ri_delete_bin_5_line className="text-red-500" />
              </div>
            }
            title="Delete Agent "
            description="This action will delete agent , you can temporarily suspend agent which wont delete his/her data."
            confirmText="Confirm & Delete"
            onCancel={() => {}}
            onConfirm={() => {}}
          >
            {/* <DeleteModal /> */}
          </DeleteModal>
        </div>
      ),
    },
  ];

  return <ReuseableTable columns={columns} data={orders} />;
}
