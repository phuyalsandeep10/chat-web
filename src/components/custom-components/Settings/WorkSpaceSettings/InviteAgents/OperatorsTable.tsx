'use client';

import React, { useState, useEffect } from 'react';
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
import {
  OperatorsOrderRow,
  OperatorColumn,
  OperatorsTableProps,
} from './types';
import { to12Hour } from './utils/AddorEditFormUtils';

export default function OperatorsTable({
  handleOpenDialog,
}: OperatorsTableProps) {
  // states to toggle modal
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openTeamView, setOpenTeamView] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // select which row to edit for operators
  const [selectedOperator, setSelectedOperator] = useState<any | null>(null);

  // mebers to delete from operators table
  const [membersToDeleteID, setMembersToDeleteID] = useState<string | null>(
    null,
  );

  // table columbe header field and row data
  const columns: OperatorColumn<OperatorsOrderRow>[] = [
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
              onClick={() => {
                const operator = allOperators?.data?.find(
                  (op: any) => op.id === row.id,
                );
                setSelectedOperator(operator);
                setOpenEdit(true);
              }}
            >
              <Icons.ri_edit2_fill className="text-black" />
            </div>
          </div>

          {/* view modal */}

          <div className="flex gap-5">
            <div
              className="h-full max-h-[36px] w-auto rounded text-xs leading-4 font-semibold"
              onClick={() => {
                const operator = allOperators?.data?.find(
                  (op: any) => op.id === row.id,
                );
                setSelectedOperator(operator);
                setOpenTeamView(true);
              }}
            >
              <Icons.ri_eye_fill className="text-black" />
              {/* <Icons.ri_edit2_fill /> */}
            </div>
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

  useEffect(() => {
    if (allOperators) {
      console.log('allOperators', allOperators);
    }
  }, [allOperators]);

  // row data of operators table
  const orders: OperatorsOrderRow[] = React.useMemo(() => {
    return (
      allOperators?.data?.map((allOperators: any) => ({
        id: allOperators.id,
        FullName: allOperators.user.name,
        Shift: allOperators.shifts.length > 0 && (
          <span>{allOperators.shifts[0].shift}</span>
        ),
        // invite: inviteMemberItems.email,
        Invitedon:
          allOperators.member_roles.length > 0
            ? format(
                new Date(allOperators.member_roles[0].role.created_at),
                'dd MMMM, yyyy',
              )
            : 'N/A',

        // status: inviteMemberItems.status,
        Roles: allOperators.member_roles
          .map((roleItems: any) => roleItems.role.name)
          .join(', '),
        OperatingHours:
          allOperators.shifts.length > 0 ? (
            <>
              <span>{allOperators.shifts[0].start_time}</span>
              <span> - </span>
              <span>{allOperators.shifts[0].end_time}</span>
            </>
          ) : (
            'N/A'
          ),
        Actions: '',
      })) || []
    );
  }, [allOperators]);

  console.log('orders', orders);

  // New function to handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!membersToDeleteID) return;
    deleteMembers(membersToDeleteID, {
      onSuccess: () => {
        setOpenDeleteModal(false);
        setMembersToDeleteID(null);
      },
      onError: (error) => {
        console.error('Failed to delete member:', error);
      },
    });
  };

  return (
    <>
      <ReuseableTable columns={columns} data={orders} />
      {/* add agennt button */}
      <AgentInviteModal
        open={openEdit}
        onOpenChange={setOpenEdit}
        dialogTitle="Edit Information"
        dialogClass="!max-w-[768px]"
      >
        <AddOrEditAgentForm
          defaultValues={{
            id: selectedOperator?.id,
            email: selectedOperator?.user.email,
            fullName: selectedOperator?.user.name,
            role:
              selectedOperator?.member_roles?.map(
                (r: { role: { name: string } }) => r.role.name,
              ) || [],
            shift: selectedOperator?.shifts[0].shift || '',
            startTime: to12Hour(selectedOperator?.shifts[0].start_time) || '',
            endTime: to12Hour(selectedOperator?.shifts[0].end_time) || '',
            clientHandled: selectedOperator?.shifts[0].client_handled || '',
            totalHours: selectedOperator?.shifts[0].total_hours || '',
            team: selectedOperator?.team.name || '',
            days: selectedOperator?.days || [],
          }}
          onClose={() => setOpenEdit(false)}
        />
      </AgentInviteModal>

      {/* add agennt button */}

      <AgentInviteModal
        open={openTeamView}
        onOpenChange={setOpenTeamView}
        dialogClass="gap-0 !max-w-[554px]"
      >
        <AgenChatHistoryCard
          selectedOperator={selectedOperator}
          submitButton="Edit Agent"
        />
      </AgentInviteModal>

      {/* delete modal of operatos table */}
      <DeleteModal
        open={openDeleteModal}
        onOpenChange={setOpenDeleteModal}
        title="Delete Agent "
        description="This action will delete agent , you can temporarily suspend agent which wont delete his/her data."
        confirmText="Confirm & Delete"
        onCancel={() => {}}
        onConfirm={handleDeleteConfirm}
      ></DeleteModal>
    </>
  );
}
