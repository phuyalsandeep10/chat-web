'use client';

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/ui/Icons';
import { ReuseableTable } from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents//ReuseableTable';
import { AgenChatHistoryCard } from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AgenChatHistoryCard';
import MailIcon from '@/assets/images/mailIcon.svg';
import Image from 'next/image';
import DeleteModal from '@/components/modal/DeleteModal';
import { Button, type ButtonProps } from '@/components/ui/button';
import TimePicker from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Invites/InviteClock';
import { useInvites } from '@/hooks/staffmanagment/invites/useInvites';
import { useDeleteInvite } from '@/hooks/staffmanagment/invites/useDeleteInvite';
import { format } from 'date-fns';

export interface OrderRow {
  id: string;
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

  // track which invite is selected
  const [inviteToDeleteId, setInviteToDeleteId] = useState<string | null>(null);

  // get all invited members
  const { data: getInviteMember, isPending, isSuccess, refetch } = useInvites();

  //delete role
  const {
    mutate: deleteInvite,
    isPending: deletePending,
    isSuccess: deleteSuccess,
  } = useDeleteInvite();

  useEffect(() => {
    if (getInviteMember) {
      console.log('Invite Data:', getInviteMember);
      // no need to return here
    }
  }, [getInviteMember]);

  const orders: OrderRow[] = React.useMemo(() => {
    return (
      getInviteMember?.data?.map((inviteMemberItems: any) => ({
        id: inviteMemberItems.id,
        invite: inviteMemberItems.email,
        invite_Sent: inviteMemberItems.created_at
          ? format(new Date(inviteMemberItems.created_at), 'dd/MM/yyyy')
          : 'N/A',
        status: inviteMemberItems.status,
        // Roles: inviteMemberItems.name,
        OperatingHours: '',
        Actions: '',
      })) || []
    );
  }, [getInviteMember]);

  // const orders: OrderRow[] = [
  //   {
  //     invite: 'unish@yahoo.com',
  //     invite_Sent: '08/07/2025',
  //     status: 'Sent',
  //     Roles: 'Admin',
  //     OperatingHours: '9:00 - 17:00',
  //     Actions: '',
  //   },
  //   {
  //     invite: 'yubeshkoirala11@gmail.com',
  //     invite_Sent: '08/07/2025',
  //     status: 'Rejected',
  //     Roles: 'Agent',
  //     OperatingHours: '9:00 - 17:00',
  //     Actions: '',
  //   },
  // ];

  // invit etable column define
  const columns: Column<OrderRow>[] = [
    { key: 'invite', label: 'Invited' },
    {
      key: 'invite_Sent',
      label: 'Invited sent on',
      render: (row) => (
        <>
          <span>{row.invite_Sent}</span>
        </>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <div className="flex gap-2">
          {row.status.toLowerCase().includes('sent') ? (
            <>
              {' '}
              <div
                className="flex items-center gap-2"
                onClick={() => setOpenReminder(true)}
              >
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
              <DeleteModal
                open={openReminder}
                onOpenChange={setOpenReminder}
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
          {/* {row.Roles.toLowerCase().includes('admin') ? (
              <Icons.ri_user_settings_fill />
            ) : (
              <Icons.ri_user_fill />
            )}
            <span>{row.Roles}</span> */}
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
        <>
          <Icons.ri_delete_bin_5_line
            className="text-red-500"
            onClick={() => {
              setInviteToDeleteId(row.id);
              setOpen(true);
            }}
          />
        </>
      ),
    },
  ];

  // handle delete invitation
  // New function to handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!inviteToDeleteId) return; // Guard clause
    deleteInvite(inviteToDeleteId, {
      onSuccess: () => {
        setOpen(false);
        setInviteToDeleteId(null);
        refetch();
      },
      onError: (error) => {
        console.error('Failed to delete invitation:', error);
      },
    });
  };

  return (
    <>
      <ReuseableTable columns={columns} data={orders} />

      {/* delete modal for invite agent */}
      <DeleteModal
        open={open}
        onOpenChange={setOpen}
        title="Delete Invitation "
        description="Delete this team and revoke member access. All related settings will be lost. Confirm before proceeding."
        confirmText="Confirm & Delete"
        onCancel={() => {}}
        onConfirm={handleDeleteConfirm}
      >
        {/* <DeleteModal /> */}
      </DeleteModal>
    </>
  );
}
