'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import AgentInviteModal from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AgentInviteModal';
import { ReuseableTable } from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/ReuseableTable';
import AddMember from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Teams/AddMember';
import CreateTeam from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Teams/CreateTeam';
import TeamView from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Teams/TeamView';
import DeleteModal from '@/components/modal/DeleteModal';
import { useCreateTeams } from '@/hooks/staffmanagment/teams/useCreateTeams';
import { useInvitesMembers } from '@/hooks/staffmanagment/teams/useInvitesMembers';
import { useDeleteTeam } from '@/hooks/staffmanagment/teams/useDeleteTeam';
import { useGetTeams } from '@/hooks/staffmanagment/teams/useGetTeams';
import TeamEdit from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Teams/TeamEdit';
// import { OrderRow, Column, TeamTableProps, FormValues } from './types';
import { useGetTeamMembersById } from '@/hooks/staffmanagment/teams/useGetTeamMembersById';
import { useUpdateTeamMembersById } from '@/hooks/staffmanagment/teams/useUpdateTeamMemberById';

interface OrderRow {
  id: string;
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

type FormValues = {
  newteam: string;
  email: string;
  fullName: string;
  role: string;
  // description: string;
};

// member_id -> access_level
type EditTeamMemberFormValues = {
  members: Record<number, string>;
};

type MemberAccess = {
  member_id: number;
  access_level: string;
};

type EditTeamMemberHandler = (data: EditTeamMemberFormValues) => void;

const TeamTable: React.FC<TeamTableProps> = ({ handleOpenDialog }) => {
  // states to toggle modal
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  // const [openTeamView, setOpenTeamView] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCreateTeam, setOpenCreateTeam] = useState(false);
  const [openTeamView, setOpenTeamView] = useState(false);
  const [openInviteMember, setOpenInviteMember] = useState(false);
  const [teamDeleteId, setTeamDeleteId] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<number | undefined>(undefined);

  //create new team
  const { mutate: createRoles, isPending, isSuccess } = useCreateTeams();

  //invite new member to the team
  const { mutate: inviteMembers } = useInvitesMembers();

  //get all teams
  const {
    data: teamsData,
    isPending: isTeamsPending,
    isSuccess: isTeamsSuccess,
    refetch,
  } = useGetTeams();

  // delete teams

  const {
    mutate: deleteTeams,
    isPending: deletePending,
    isSuccess: deleteSuccess,
  } = useDeleteTeam();

  //fetch team members by id

  const { data: teamMembersById } = useGetTeamMembersById(teamId);

  //update member by id
  const { mutate: updateTeamMemberById } = useUpdateTeamMembersById();

  // onsubit functions
  const handleSubmit = (formData?: FormValues) => {
    const payload = {
      name: formData?.newteam,
      // description: 'New team created',
    };

    // Creating a new role
    createRoles(payload, {
      onSuccess: (response) => {
        console.log('Create Team response:', response);
        setOpenCreateTeam(false);
      },
      onError: (error) => {
        console.error('Create Team error:', error);
      },
    });
  };

  //invie new member
  const handleInviteMember = (InviteData: FormValues) => {
    const payload = {
      email: InviteData.email,
      name: InviteData.fullName,
      role_ids: Array.isArray(InviteData.role)
        ? InviteData.role.map((id) => Number(id)).filter((id) => !isNaN(id))
        : [],
    };
    console.log('Payload being sent to inviteMembers:', payload);

    inviteMembers(payload, {
      onSuccess: () => {
        console.log('Invite member response:', payload);
        setOpenInviteMember((prev) => !prev);
      },
      onError: (error) => {
        console.error('failed to Invite member:', error);
      },
    });
  };

  // handle delete Teams

  const handleDeleteTeams = (teamId?: any) => {
    if (!teamDeleteId) return;
    deleteTeams(teamDeleteId, {
      onSuccess: () => {
        setOpenDeleteModal(false);
        refetch();
        // Optionally, you can refetch the teams data or update the UI accordingly
      },
      onError: (error) => {
        console.error('Failed to delete team:', error);
        // Optionally show error message/toast
      },
    });
  };

  // handle edit team member by id
  const handleEditTeamMemberById: EditTeamMemberHandler = (formData) => {
    if (!teamId) return;

    const membersPayload: MemberAccess[] = Object.entries(
      formData.members || {},
    )
      .filter(([_, access_level]) => access_level)
      .map(([member_id, access_level]) => ({
        member_id: Number(member_id),
        access_level: String(access_level),
      }));

    if (!membersPayload.length) return;

    updateTeamMemberById({ teamId, members: membersPayload });
    setOpenEdit(false);
  };

  const orders: OrderRow[] = React.useMemo(() => {
    return (
      teamsData?.data?.map((teamsDataItems: any) => ({
        id: teamsDataItems.id,
        TeamName: teamsDataItems.name,
        Lead: teamsDataItems.lead_name,
        Status: teamsDataItems.status,
        Actions: '',
      })) || []
    );
  }, [teamsData]);

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
      render: (row) => (
        <div className="flex items-center gap-[10px]">
          {/* edit form */}
          <div
            className="h-full max-h-[36px] w-auto rounded text-xs leading-4 font-semibold"
            onClick={() => {
              setTeamId(Number(row.id)); //based on id open edit modal
              setOpenEdit(true);
            }}
          >
            <Icons.ri_edit2_fill className="text-black" />
          </div>

          {/* view team */}
          <div
            className="h-full max-h-[36px] w-auto rounded text-xs leading-4 font-semibold"
            onClick={() => {
              setTeamId(Number(row.id));
              setOpenTeamView(true);
            }}
          >
            <Icons.ri_eye_fill className="text-black" />
          </div>

          {/* delete modal */}
          <div
            className="h-full max-h-[36px] w-auto rounded text-xs leading-4 font-semibold"
            onClick={() => {
              setTeamDeleteId(row.id);
              setOpenDeleteModal(true);
            }}
          >
            <Icons.ri_delete_bin_5_line className="text-red-500" />
            {/* <Icons.ri_edit2_fill /> */}
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (teamMembersById) console.log('teamMembersById', teamMembersById);
  }, [teamMembersById]);

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
              onSubmit={handleSubmit}
              onCancel={() => setOpenCreateTeam(false)}
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
            <AddMember onSubmit={handleInviteMember} />
          </AgentInviteModal>
        </div>
      </div>
      {/* Team table from order */}
      <ReuseableTable columns={columns} data={orders} />
      {/* edit modal for edit team */}
      <AgentInviteModal
        open={openEdit}
        onOpenChange={setOpenEdit}
        dialogTitle="Edit Information"
        dialogClass="!max-w-[768px]"
      >
        <TeamEdit
          // onSubmit={handleEditTeamMemberById}
          // onSubmit={handleEditTeamMemberById as unknown as (data: any) => void}
          onSubmit={handleEditTeamMemberById as EditTeamMemberHandler}
          data={teamMembersById}
          teamId={teamId}
          // defaultValues={teamsData?.data?.find((t) => t.id === teamId)}
        />
      </AgentInviteModal>
      {/* view modal for view team */}
      <AgentInviteModal
        open={openTeamView}
        onOpenChange={setOpenTeamView}
        dialogTitle="Edit Information"
        dialogClass="!max-w-[768px]"
      >
        <TeamView teamId={teamId!} data={teamMembersById} />
      </AgentInviteModal>
      {/* delete modal for delete team */}
      <DeleteModal
        open={openDeleteModal}
        onOpenChange={setOpenDeleteModal}
        title="Delete Team "
        description="Delete this team and revoke member access. All related settings will be lost. Confirm before proceeding."
        confirmText="Confirm & Delete"
        onCancel={() => {}}
        onConfirm={handleDeleteTeams}
      >
        {/* <DeleteModal /> */}
      </DeleteModal>
    </>
  );
};

export default TeamTable;
