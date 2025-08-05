'use client';

import React, { useState } from 'react';
import { Icons } from '@/components/ui/Icons';
// import ReusableDialog from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/ReusableDialog';
// import AddAgent from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AddAgent';
import { ReuseableTable } from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents//ReuseableTable';
import { AgenChatHistoryCard } from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AgenChatHistoryCard';
import MailIcon from '@/assets/images/mailIcon.svg';
import Image from 'next/image';
import DeleteModal from '@/components/modal/DeleteModal';
import { Button, type ButtonProps } from '@/components/ui/button';
import { TimePicker } from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Invites/InviteClock';

export interface OrderRow {
  invite: string;
  invite_Sent: string;
  status: string;
  Roles: string;
  OperatingHours: string;
  Actions: string;
}

interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (row: T) => React.ReactNode;
}

export interface InviteAgentProps {
  handleOpenDialog: (props: {
    heading: string;
    subheading: string;
    onAction: () => void;
    headericon?: React.ReactNode;
    submitButton?: string;
  }) => void;
}

export default function InviteTable({ handleOpenDialog }: InviteAgentProps) {
  const [open, setOpen] = useState(false);
  const [openReminder, setOpenReminder] = useState(false);

  const orders: OrderRow[] = [
    {
      invite: 'unish@yahoo.com',
      invite_Sent: '08/07/2025',
      status: 'Sent',
      Roles: 'Admin',
      OperatingHours: '9:00 - 17:00',
      Actions: '',
    },
    {
      invite: 'yubeshkoirala11@gmail.com',
      invite_Sent: '08/07/2025',
      status: 'Rejected',
      Roles: 'Agent',
      OperatingHours: '9:00 - 17:00',
      Actions: '',
    },
  ];

  // invit etable column define
  const columns: Column<OrderRow>[] = [
    { key: 'invite', label: 'Invited' },
    {
      key: 'invite_Sent',
      label: 'Invited sent on',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <div className="flex gap-2">
          {row.status.toLowerCase().includes('sent') ? (
            <>
              {' '}
              <DeleteModal
                open={openReminder}
                onOpenChange={setOpenReminder}
                trigger={
                  <div className="flex items-center gap-2">
                    <span>{row.status}</span>
                    {row.status.toLowerCase().includes('sent') && (
                      <Image
                        src={MailIcon}
                        alt="Mail Icon"
                        width={16}
                        height={16}
                        className="h-4 w-4"
                      />
                    )}
                  </div>
                }
                title="Send Reminder"
                description="Do you want to notify about the invitation you sent to join the workspace ?"
                icon={<Icons.ri_time_fill className="text-brand-primary" />}
                iconBgColor="bg-brand-light"
                descriptionColor="text-brand-primary"
                confirmVariant="default"
                confirmText="Send Reminder"
                onCancel={() => {}}
                onConfirm={() => {}}
              >
                {/* <DeleteModal /> */}
              </DeleteModal>
            </>
          ) : (
            <span>{row.status}</span>
          )}
        </div>
      ),
    },
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
    {
      key: 'OperatingHours',
      label: 'Operating Hours',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <DeleteModal
          open={open}
          onOpenChange={setOpen}
          trigger={
            <div className="flex items-center gap-2">
              <Icons.ri_delete_bin_5_line className="text-red-500" />
            </div>
          }
          title="Delete Invitation "
          description="Delete this team and revoke member access. All related settings will be lost. Confirm before proceeding."
          confirmText="Confirm & Delete"
          onCancel={() => {}}
          onConfirm={() => {}}
        >
          {/* <DeleteModal /> */}
        </DeleteModal>
      ),
    },
  ];

  return (
    <>
      <ReuseableTable columns={columns} data={orders} />
      {/* <InviteClockModal /> */}
      <TimePicker />
    </>
  );
}
