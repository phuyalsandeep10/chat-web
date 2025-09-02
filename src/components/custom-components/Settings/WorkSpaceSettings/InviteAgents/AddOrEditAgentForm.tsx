import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/common/hook-form/InputField';
import Label from '@/components/common/hook-form/Label';
import { Form } from '@/components/ui/form';
import AgentInviteModal from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AgentInviteModal';
import AddMember from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Teams/AddMember';
import { useTimeStore } from '@/components/store/timeStore';
import { useEditOperator } from '@/hooks/staffmanagment/operators/useEditOperator';
import { useGetTeams } from '@/hooks/staffmanagment/teams/useGetTeams';
import { useGetAllRolePermissionGroup } from '@/hooks/staffmanagment/roles/useGetAllRolePermissionGroup';
import { parse } from 'date-fns';
import TimeField from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/utils/TimeField';
import {
  to24Hour,
  capitalize,
  diffInMinutes,
} from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/utils/AddorEditFormUtils';
import TeamField from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/utils/TeamField';
import {
  AddorEditFormValues,
  Team,
  Role,
  RolePermission,
  AddOrEditAgentFormProps,
} from './types';
import DayField from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/utils/DayField';
import ClientField from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/utils/ClientField';
import RoleField from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/utils/RoleField';
import ShiftField from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/utils/ShiftField';

const AddOrEditAgentForm: React.FC<AddOrEditAgentFormProps> = ({
  defaultValues,
  onSubmit,
  submitButton = 'Add Agent',
  onClose,
}) => {
  const form = useForm<AddorEditFormValues>({
    defaultValues: { ...defaultValues },
  });

  // components states
  const [openInviteMember, setOpenInviteMember] = useState(false);
  // toggle time picker/clock dial
  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);

  // edit operatorss
  const { mutate: editOperators, isPending, isError } = useEditOperator();

  //get all teams
  const {
    data: teamsData,
    isPending: isTeamsPending,
    isSuccess: isTeamsSuccess,
    refetch,
  } = useGetTeams();

  // get all roles
  const {
    data: roleTableData,
    isPending: roleDataPending,
    isSuccess: roleSuccess,
  } = useGetAllRolePermissionGroup();

  const savedTime = useTimeStore((state) => state.savedTime);
  const { control, setValue, getValues, reset, watch } = form; // Get setValue from the main form instance

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, form]);

  const handleAddTeamMember = (data: any) => {
    setOpenInviteMember(false);
  };

  const handleSubmit = (data: AddorEditFormValues) => {
    // find team
    const selectedTeam = teamsData?.data?.find(
      (team: any) => team.name === data.team,
    );

    // normalize roles to always be an array
    const roleNames = Array.isArray(data.role) ? data.role : [data.role];

    // select role
    const selectedRoles = roleTableData?.data?.filter((role: any) =>
      roleNames.includes(role.role_name),
    );

    const total_minutes = diffInMinutes(data.startTime, data.endTime);

    const payload = {
      role_ids: selectedRoles?.map((r: any) => r.role_id) || [],
      client_handled: data.clientHandled,
      day: capitalize(data.day || ''),
      shift: data.shift,
      start_time: to24Hour(data.startTime),
      end_time: to24Hour(data.endTime),
      team_id: selectedTeam?.id ?? null,
      email: data.email,
      total_hours: total_minutes,
    };

    editOperators(
      { member_id: defaultValues?.id ?? 0, payload },
      { onSuccess: () => onClose?.() },
    );
  };

  // Calculate totalHours whenever startTime or endTime changes
  useEffect(() => {
    const startTime = getValues('startTime');
    const endTime = getValues('endTime');

    const timeRegex = /^([0]?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;

    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) return;

    try {
      // Difference in minutes
      const start = parse(startTime, 'hh:mm a', new Date());
      const end = parse(endTime, 'hh:mm a', new Date());
      const diffInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);

      setValue(
        'totalHours',
        diffInMinutes > 0 ? diffInMinutes.toString() : '0',
      );
    } catch {
      setValue('totalHours', '0');
    }
  }, [watch('startTime'), watch('endTime')]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="font-outfit grid grid-cols-1 gap-6 text-xs leading-[21px] font-normal md:grid-cols-2"
        >
          {/* Email Field */}
          <div>
            <InputField
              name="email"
              label="Enter Agent Email"
              inputClassName="!text-xs leading-[21px] font-normal !text-black"
              labelClassName=" text-base leading-[26px] font-medium"
              control={control}
              required
              readOnly
              disabled
            />
          </div>

          {/* Full Name Field */}
          <div>
            <InputField
              name="fullName"
              inputClassName="!text-xs leading-[21px] font-normal !text-black"
              control={control}
              label="Full Name"
              labelClassName="text-base leading-[26px] font-medium"
              readOnly
              disabled
            />
          </div>

          {/* Role Field */}
          <RoleField control={control} roleTableData={roleTableData} />

          {/* Client Handled Field */}
          <ClientField control={control} />

          {/* Day Picker */}
          <DayField control={control} />

          {/* Shift Field */}
          <ShiftField control={control} />

          {/* Work Schedule */}
          <div className="col-span-full">
            <Label
              htmlFor="Workschedule"
              className="text-base leading-[26px] font-medium"
              required
            >
              Work Schedule
            </Label>
            <div className="grid grid-cols-3 gap-[26px]">
              <TimeField
                name="startTime"
                label="Start Time"
                onChange={(val: string) => setValue('startTime', val)}
                setOpen={setOpenStartTime}
                open={openStartTime}
                control={control}
              />

              <TimeField
                name="endTime"
                label="End Time"
                onChange={(val: string) => setValue('endTime', val)}
                setOpen={setOpenEndTime}
                open={openEndTime}
                control={control}
              />

              <div className="w-full">
                <InputField
                  name="totalHours"
                  control={control}
                  placeholder="8"
                  inputClassName="!text-xs leading-[21px] font-normal"
                  label="Total Hours"
                  labelClassName="text-base leading-[26px] font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Team Selection */}
          <TeamField
            teamsData={teamsData}
            control={control}
            setOpenInviteMember={setOpenInviteMember}
          />

          <Button
            type="submit"
            className="col-span-full mt-4 h-full max-h-[36px] w-full rounded-lg px-[22px] py-2.5 text-xs leading-4 font-semibold"
          >
            {submitButton}
          </Button>
        </form>
      </Form>

      {/* Add Team Member Modal */}
      <AgentInviteModal
        open={openInviteMember}
        onOpenChange={setOpenInviteMember}
        dialogClass="!max-w-[768px] py-[27px] px-10 gap-0"
      >
        <AddMember onSubmit={handleAddTeamMember} />
      </AgentInviteModal>
    </>
  );
};

export default AddOrEditAgentForm;
