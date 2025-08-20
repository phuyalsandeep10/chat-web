'use client';

import React, { useState } from 'react';
import { Icons } from '@/components/ui/Icons';
import AgentInviteModal from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AgentInviteModal';
// import { ReuseableTable } from './ReuseableTable';
import { AgenChatHistoryCard } from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AgenChatHistoryCard';
import DeleteModal from '@/components/modal/DeleteModal';
import AddOrEditAgentForm from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AddOrEditAgentForm';
import { ReuseableTable } from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/ReuseableTable';
import { useGetOperator } from '@/hooks/staffmanagment/operators/useGetOperator';
import { useDeleteMember } from '@/hooks/staffmanagment/operators/useDeleteMembers';
import { format } from 'date-fns';

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

  const [membersToDeleteID, setMembersToDeleteID] = useState<string | null>(
    null,
  );

  // const orders: OrderRow[] = [
  //   {
  //     FullName: 'Yubesh Koirala',
  //     Roles: 'Admin',
  //     Shift: 'morning',
  //     OperatingHours: '9:00 - 17:00',
  //     Invitedon: '08/07/2025',
  //     Actions: '',
  //   },
  //   {
  //     FullName: 'Yubesh Koirala',
  //     Roles: 'Agent',
  //     Shift: 'Day',
  //     OperatingHours: '9:00 - 17:00',
  //     Invitedon: '08/07/2025',
  //     Actions: '',
  //   },
  // ];

  const columns: Column<OrderRow>[] = [
    { key: 'FullName', label: 'Full Name' },
    {
      key: 'Roles',
      label: 'Roles',
      render: (row) => (
        <div className="flex items-center gap-2">
          {/* {row.Roles.toLowerCase().includes('admin') ? (
            <Icons.ri_user_settings_fill />
          ) : (
            <Icons.ri_user_fill />
          )} */}
          <span>{row.Roles}</span>
        </div>
      ),
    },
    { key: 'Shift', label: 'Shift' },
    {
      key: 'OperatingHours',
      label: 'Operating Hours',
      // render: (row) => {
      //   const isOperating = row.OperatingHours.trim() !== '';
      //   return (
      //     <div className="flex items-center gap-2">
      //       <span>{row.OperatingHours}</span>
      //       <span
      //         className={`h-2 w-2 rounded-full ${
      //           isOperating ? 'bg-[#009959]' : 'bg-[#F61818]'
      //         }`}
      //       />
      //     </div>
      //   );
      // },
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
              onClick={() => {
                setMembersToDeleteID(row.id);
                setOpenDeleteModal(true);
              }}
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

  // get all members
  const { data: allOperators, isPending, isError } = useGetOperator();

  //delete operators/members
  const {
    mutate: deleteMembers,
    isPending: deletePending,
    isSuccess: deleteSuccess,
  } = useDeleteMember();

  const orders: OrderRow[] = React.useMemo(() => {
    return (
      allOperators?.data?.map((allOperators: any) => ({
        id: allOperators.id,
        FullName: allOperators.user_name,
        Roles: allOperators.role_name,
        // invite: inviteMemberItems.email,
        Invitedon: allOperators.created_at
          ? format(new Date(allOperators.created_at), 'dd MMMM, yyyy')
          : 'N/A',
        // status: inviteMemberItems.status,
        // Roles: inviteMemberItems.name,
        // OperatingHours: '',
        Actions: '',
      })) || []
    );
  }, [allOperators]);

  // New function to handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!membersToDeleteID) return;
    deleteMembers(membersToDeleteID, {
      onSuccess: () => {
        setOpenDeleteModal(false);
        setMembersToDeleteID(null);
        // refetch roles here or trigger update UI logic
      },
      onError: (error) => {
        console.error('Failed to delete role:', error);
        // Optionally show error message/toast
      },
    });
  };

  return <ReuseableTable columns={columns} data={orders} />;
}
