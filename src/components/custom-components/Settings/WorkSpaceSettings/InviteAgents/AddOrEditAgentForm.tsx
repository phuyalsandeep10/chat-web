import React, { useState, useEffect } from 'react';
import { useForm, Control, SubmitHandler } from 'react-hook-form';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { AddOrEditAgentSchema, AddOrEditAgentFormSchema } from './FormSchema';

const AddOrEditAgentForm: React.FC<AddOrEditAgentFormProps> = ({
  defaultValues,
  onSubmit,
  submitButton = defaultValues ? 'Edit Agent' : 'Add Agent',
  onClose,
}) => {
  const form = useForm<AddOrEditAgentFormSchema>({
    resolver: zodResolver(AddOrEditAgentSchema),
    defaultValues: {
      email: defaultValues?.email ?? '',
      fullName: defaultValues?.fullName ?? '',
      role: defaultValues?.role ?? [], // array
      clientHandled: defaultValues?.clientHandled ?? '', // string
      days: defaultValues?.days ?? [], // array
      shift: defaultValues?.shift ?? '',
      startTime: defaultValues?.startTime ?? '',
      endTime: defaultValues?.endTime ?? '',
      totalHours: defaultValues?.totalHours ?? '',
      team: defaultValues?.team ?? '',
    },
  });

  console.log('defaultValues', defaultValues);

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

  // reset from after submit
  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, form]);

  const handleAddTeamMember = (data: any) => {
    setOpenInviteMember(false);
  };

  const handleSubmit: SubmitHandler<AddOrEditAgentFormSchema> = (data) => {
    console.log('formData', data);
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

    // convert dat into array
    const dayArray = Array.isArray(data.days) ? data.days : [data.days];
    const day = dayArray.map(capitalize); // <-- map each element

    const payload = {
      role_ids: selectedRoles?.map((r: any) => r.role_id) || [],
      client_handled: data.clientHandled,
      day,
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

    if (!startTime || !endTime) return;

    try {
      const minutes = diffInMinutes(startTime, endTime);
      setValue('totalHours', minutes > 0 ? minutes.toString() : '0');
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
              // readOnly
              // disabled
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
              // readOnly
              // disabled
            />
          </div>

          {/* Role Field */}
          <RoleField
            control={control}
            roleTableData={roleTableData}
            errorMessage={form.formState.errors.role?.message}
          />

          {/* Client Handled Field */}
          <ClientField
            control={control}
            errorMessage={form.formState.errors.clientHandled?.message}
          />

          {/* Day Picker */}
          <DayField
            control={control}
            errorMessage={form.formState.errors.days?.message}
          />

          {/* Shift Field */}
          <ShiftField
            control={control}
            errorMessage={form.formState.errors.shift?.message}
          />

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
                defaultValue={getValues('startTime')}
                setOpen={setOpenStartTime}
                open={openStartTime}
                control={control}
                errorMessage={form.formState.errors.startTime?.message}
              />

              <TimeField
                name="endTime"
                label="End Time"
                onChange={(val: string) => setValue('endTime', val || '')}
                defaultValue={getValues('endTime')}
                setOpen={setOpenEndTime}
                open={openEndTime}
                control={control}
                errorMessage={form.formState.errors.endTime?.message}
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
            errorMessage={form.formState.errors.team?.message}
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
