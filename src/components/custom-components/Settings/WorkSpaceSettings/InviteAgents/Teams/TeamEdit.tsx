import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { InputField } from '@/components/common/hook-form/InputField';
import Label from '@/components/common/hook-form/Label';
import { Form } from '@/components/ui/form';
import { Icons } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';
import { useDeleteTeamFromTeam } from '@/hooks/staffmanagment/teams/useDeleteTeamFromTeam';
import DeleteModal from '@/components/modal/DeleteModal';
import { useQueryClient } from '@tanstack/react-query';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EditTeamFormValues, TeamEditProps } from './types';

const TeamEdit: React.FC<TeamEditProps> = ({
  defaultValues = {},
  onSubmit,
  data,
  teamId,
}) => {
  const form = useForm<EditTeamFormValues>({
    defaultValues: {
      teamname: '',
      members: {},
      ...defaultValues,
    },
  });

  // Track if member is selected or not
  // const [hasSelectedMemberRole, setHasSelectedMemberRole] = useState(
  //   !!form.getValues('member'),
  // );

  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [OpenDeleteMember, setOpenDeleteMember] = useState<boolean>(false);

  const handleViewMember = (memberId: number) => {
    setSelectedMemberId(memberId);
  };

  // delete members from team
  const { mutate: deleteMembersFromTeam } = useDeleteTeamFromTeam();

  // prefilled the data if avaiable
  useEffect(() => {
    if (data?.data) {
      const initialMembers = data.data.reduce(
        (acc, member) => {
          acc[member.member_id] = member.access_levels;
          return acc;
        },
        {} as Record<string, string>,
      );

      // Only reset if data changed
      if (
        JSON.stringify(form.getValues('members')) !==
        JSON.stringify(initialMembers)
      ) {
        form.reset({
          ...form.getValues(),
          members: initialMembers,
        });
      }
    }
  }, [data]);

  // // selected member id to delete
  const selectedMember = data?.data?.find(
    (m: any) => m.member_id === selectedMemberId,
  );

  const memberIdToDelete = selectedMember?.member_id;

  // delete members from teams
  const handleDeleteTeam = () => {
    // if (!teamId && !memberIdToDelete) return;
    if (teamId == null || memberIdToDelete == null) return;

    deleteMembersFromTeam(
      { team_id: teamId, member_id: memberIdToDelete },
      {
        onError: (error: any) => {
          console.log('Failed to delete member:', error);
        },
      },
    );
  };

  return (
    <Card className="w-full max-w-full border-0 p-0 shadow-none">
      {/* ... CardHeader and other form code above ... */}

      <CardContent className="p-0">
        <Form {...form}>
          <form id="team-edit-form" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Team Name Input */}
            {/* ... */}

            {/* Member Role ToggleGroup with initial bg-primary before select */}
            <div className="pb-5">
              <Label
                required
                htmlFor="member"
                className="pb-3 text-base leading-[26px] font-medium"
              >
                Team Member
              </Label>

              <Controller
                name="members"
                control={form.control}
                render={({ field }) => (
                  <div className="border-grey-light rounded-sm border">
                    {data?.data?.map((teamMember) => {
                      const { username, access_levels, member_id } = teamMember;

                      // use form state if it exists, else fallback to API value
                      // const currentValue =
                      //   field.value?.[member_id] ?? access_levels;

                      return (
                        <div
                          key={member_id}
                          className="flex items-center justify-between rounded-sm px-5 py-[18px]"
                        >
                          <span>{username}</span>
                          <div className="flex items-center gap-3.5">
                            <ToggleGroup
                              type="single"
                              className="bg-brand-disable flex gap-7 px-[13px] py-1"
                              // value={field.value?.[member_id] || []}
                              value={field.value?.[member_id] || ''}
                              onValueChange={(value) =>
                                field.onChange({
                                  ...field.value,
                                  [member_id]: value,
                                })
                              }
                            >
                              {['LEAD', 'ADMIN', 'MODERATOR', 'MEMBER'].map(
                                (role) => (
                                  <ToggleGroupItem
                                    key={role}
                                    value={role}
                                    className={cn(
                                      'rounded-[4px] px-[15px] py-[2px] text-black', // default text
                                      'data-[state=on]:bg-brand-primary data-[state=on]:text-white', // active state handled automatically
                                    )}
                                  >
                                    {role}
                                  </ToggleGroupItem>
                                ),
                              )}
                            </ToggleGroup>
                            <Icons.ri_delete_bin_5_line
                              className="text-alert-prominent cursor-pointer"
                              onClick={() => {
                                field.onChange({
                                  ...field.value,
                                  [member_id]: '', // clear access level for this member
                                });
                                setSelectedMemberId(member_id);
                                setOpenDeleteMember(true);
                              }}
                            />
                            {/* delete modal for delete team */}
                            <DeleteModal
                              open={OpenDeleteMember}
                              onOpenChange={setOpenDeleteMember}
                              title="Delete Team "
                              description="Delete this team and revoke member access. All related settings will be lost. Confirm before proceeding."
                              confirmText="Confirm & Delete"
                              onCancel={() => {}}
                              onConfirm={handleDeleteTeam}
                            >
                              {/* <DeleteModal /> */}
                            </DeleteModal>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              />
            </div>

            {/* Add Member button */}
            <Button
              type="submit"
              className="bg-brand-disable text-brand-primary hover:bg-brand-disable h-full max-h-[36px] w-full rounded-sm px-[22px] py-3 text-xs leading-4 font-semibold"
            >
              <Icons.plus />
              Add Member
            </Button>
          </form>
        </Form>
      </CardContent>

      {/* Save Change button */}
      <CardFooter className="flex justify-end gap-4 p-0">
        <Button
          type="submit"
          className="h-full max-h-[36px] w-auto rounded-lg px-[22px] py-3 text-xs leading-4 font-semibold"
          form="team-edit-form"
        >
          Save Change
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeamEdit;
