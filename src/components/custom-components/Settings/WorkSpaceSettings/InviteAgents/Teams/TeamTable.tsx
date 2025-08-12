'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import AgentInviteModal from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AgentInviteModal';
// import AddAgent from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AddAgent';
import { ReuseableTable } from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/ReuseableTable';
import AddMember from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Teams/AddMember';
import CreateTeam from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Teams/CreateTeam';
import TeamEdit from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Teams/TeamEdit';
import TeamView from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Teams/TeamView';
import DeleteModal from '@/components/modal/DeleteModal';
import AddOrEditAgentForm from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AddOrEditAgentForm';

export interface OrderRow {
  TeamName: string;
  Lead: string;
  Status: string;
  Actions: string;
}

interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface TeamTableProps {
  handleOpenDialog: (options: {
    heading: string;
    subheading: string;
    onAction: () => void;
    headericon: React.ReactNode;
  }) => void;
}

// const { mutate: createRoles, isPending, isSuccess } = useCreateTeams();

// const handleSubmit = (formData: FormValues) => {
//   const payload = {
//     newteam: formData.newteam,
//   };

//   // Creating a new role
//   createRoles(payload, {
//     onSuccess: (response) => {
//       console.log('Create Team response:', response);
//     },
//     onError: (error) => {
//       console.error('Create Team error:', error);
//     },
//   });
// };

const TeamTable: React.FC<TeamTableProps> = ({ handleOpenDialog }) => {
  // states to toggle modal
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  // const [openTeamView, setOpenTeamView] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCreateTeam, setOpenCreateTeam] = useState(false);
  const [openTeamView, setOpenTeamView] = useState(false);
  const [openInviteMember, setOpenInviteMember] = useState(false);

  const orders: OrderRow[] = [
    {
      TeamName: 'Team A',
      Lead: 'Joshna Khadka',
      Status: 'Admin',
      Actions: '',
    },
    {
      TeamName: 'Team B',
      Lead: 'Joshna Khadka',
      Status: 'Admin',
      Actions: '',
    },
  ];

  const columns: Column<OrderRow>[] = [
    { key: 'TeamName', label: 'Team Name' },
    {
      key: 'Lead',
      label: 'Lead',
      render: (row) => (
        <div className="flex items-center gap-[10px]">
          <div className="bg-gray-primary flex h-[20px] w-[20px] items-center justify-center rounded-full">
            <Icons.ri_user_fill className="text-xs text-white" />
          </div>
          <span>{row.Lead}</span>
        </div>
      ),
    },
    { key: 'Status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center gap-[10px]">
          {/* <AddOrEditAgentForm
            trigger={
              <button aria-label="Edit team">
                <Icons.ri_edit2_fill className="text-black" />
              </button>
            }
            dialogClass="!max-w-[768px] gap-0 px-5 py-10"
          >
            <TeamEdit onSubmit={() => {}} />
          </AddOrEditAgentForm>
          <AddOrEditAgentForm
            trigger={
              <button aria-label="View team">
                <Icons.ri_eye_fill />
              </button>
            }
            dialogClass="!max-w-[411px] gap-0 inline-block"
          >
            <TeamView />
          </AddOrEditAgentForm> */}
          {/* edit form */}
          <div>
            <div
              className="h-full max-h-[36px] w-auto rounded text-xs leading-4 font-semibold"
              onClick={() => setOpenEdit(true)}
            >
              <Icons.ri_edit2_fill className="text-black" />
            </div>
            <AgentInviteModal
              open={openEdit}
              onOpenChange={setOpenEdit}
              dialogTitle="Edit Information"
              dialogClass="!max-w-[768px]"
            >
              <AddOrEditAgentForm />
            </AgentInviteModal>
          </div>

          {/* view team */}
          <div>
            <div
              className="h-full max-h-[36px] w-auto rounded text-xs leading-4 font-semibold"
              onClick={() => setOpenTeamView(true)}
            >
              <Icons.ri_eye_fill className="text-black" />
            </div>
            <AgentInviteModal
              open={openTeamView}
              onOpenChange={setOpenTeamView}
              dialogTitle="Edit Information"
              dialogClass="!max-w-[768px]"
            >
              <TeamView />
            </AgentInviteModal>
          </div>

          {/* delete modal */}
          <div
            className="h-full max-h-[36px] w-auto rounded text-xs leading-4 font-semibold"
            onClick={() => setOpenDeleteModal(true)}
          >
            <Icons.ri_delete_bin_5_line className="text-red-500" />
            {/* <Icons.ri_edit2_fill /> */}
          </div>
          <DeleteModal
            open={openDeleteModal}
            onOpenChange={setOpenDeleteModal}
            title="Delete Team "
            description="Delete this team and revoke member access. All related settings will be lost. Confirm before proceeding."
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

  return (
    <>
      {/* Team table header */}
      <div className="pb-[24px]">
        <p className="text-brand-dark pb-[3px] text-sm leading-[21px] font-semibold">
          Team Member
        </p>
        <span className="text-xs leading-[17px] font-normal">
          View and manage all members in your workspace. Assign roles and
          control access.
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pb-[13px]">
        {/* create new team */}
        <div>
          <Button
            className="h-[36px] rounded px-[22px] py-2.5 text-xs leading-4 font-semibold"
            onClick={() => setOpenCreateTeam(true)}
          >
            <Icons.plus_circle />
            Create New Team
          </Button>
          <AgentInviteModal
            open={openCreateTeam}
            onOpenChange={setOpenCreateTeam}
            dialogClass="!max-w-[387px] py-10 w-full px-5 gap-0 inline-block"
          >
            <CreateTeam
              onSubmit={(data) => console.log('Team created:', data)}
            />
          </AgentInviteModal>
        </div>

        {/* invite new member */}
        <div>
          <Button
            variant="outline"
            className="bg-brand-primary h-[36px] rounded px-[22px] py-2.5 text-xs leading-4 font-semibold text-white"
            onClick={() => setOpenInviteMember(true)}
          >
            <Icons.plus_circle />
            Invite New Member
          </Button>
          <AgentInviteModal
            open={openInviteMember}
            onOpenChange={setOpenInviteMember}
            dialogClass="!max-w-[768px] py-[27px] px-10 gap-0"
          >
            <AddMember
              onSubmit={(data) => console.log('Team created:', data)}
            />
          </AgentInviteModal>
        </div>
      </div>

      {/* Team table */}
      <ReuseableTable columns={columns} data={orders} />
    </>
  );
};

export default TeamTable;
