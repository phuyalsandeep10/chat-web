import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from '@/components/ui/select';
import { InputField } from '@/components/common/hook-form/InputField';
import Label from '@/components/common/hook-form/Label';
import { Form } from '@/components/ui/form';
import AgentInviteModal from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AgentInviteModal';
import AddMember from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Teams/AddMember';
import { SelectField } from '@/components/common/hook-form/SelectField';
import { useTimeStore } from '@/components/store/timeStore';
import TimePicker from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Invites/InviteClock';
import { useEditOperator } from '@/hooks/staffmanagment/operators/useEditOperator';
import { useGetTeams } from '@/hooks/staffmanagment/teams/useGetTeams';
import { useGetAllRolePermissionGroup } from '@/hooks/staffmanagment/roles/useGetAllRolePermissionGroup';
import { parse, format } from 'date-fns';

import {
  AddorEditFormValues,
  Team,
  Role,
  RolePermission,
  AddOrEditAgentFormProps,
} from './types';

const AddOrEditAgentForm: React.FC<AddOrEditAgentFormProps> = ({
  defaultValues,
  onSubmit,
  submitButton = 'Add Agent',
  onClose,
}) => {
  const form = useForm<AddorEditFormValues>({
    defaultValues: {
      day: 'Select Day',
      shift: 'Select Shift',
      email: '',
      fullName: '',
      role: '',
      clientHandled: '',
      startTime: '',
      endTime: '',
      totalHours: '',
      team: '',
      ...defaultValues,
    },
  });

  // components states
  const [open, setOpen] = useState(false);
  const [openInviteMember, setOpenInviteMember] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);

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
  const { setValue } = form; // Get setValue from the main form instance

  // toggle time picker/clock dial
  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);
  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  useEffect(() => {
    if (defaultValues) form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleAddTeamMember = (data: any) => {
    setTeams((prev) => [...prev, { value: data.value, label: data.label }]);
    setOpenInviteMember(false);
  };

  // helper (handles overnight shifts too)
  const diffInMinutes = (start12: string, end12: string) => {
    if (!start12 || !end12) return 0;
    const start = parse(start12, 'hh:mm a', new Date());
    const end = parse(end12, 'hh:mm a', new Date());
    if (end < start) end.setDate(end.getDate() + 1); // cross-midnight
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  }; //place in another function

  const handleSubmit = (data: AddorEditFormValues) => {
    // capitalize first letter of days
    const capitalize = (s: string | string[]) => {
      if (Array.isArray(s)) {
        return s.map(
          (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),
        );
      }
      if (typeof s !== 'string') return s;
      return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    };

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

    // conver etime format into 24 hour
    const to24Hour = (time12h: string) => {
      if (!time12h) return '';
      const parsed = parse(time12h, 'hh:mm a', new Date());
      return format(parsed, 'HH:mm');
    };

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
    const startTime = form.getValues('startTime');
    const endTime = form.getValues('endTime');

    const timeRegex = /^([0]?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;

    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) return;

    try {
      const start = parse(startTime, 'hh:mm a', new Date());
      const end = parse(endTime, 'hh:mm a', new Date());

      // Difference in minutes
      const diffInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      form.setValue(
        'totalHours',
        diffInMinutes > 0 ? diffInMinutes.toString() : '0',
      );
    } catch {
      form.setValue('totalHours', '0');
    }
  }, [form.watch('startTime'), form.watch('endTime')]);

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
              control={form.control}
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
              control={form.control}
              label="Full Name"
              labelClassName="text-base leading-[26px] font-medium"
              readOnly
              disabled
            />
          </div>

          {/* Role Field */}
          <div>
            <Controller
              name="role"
              control={form.control}
              render={({ field }) => (
                <SelectField
                  {...field}
                  required
                  placeholder="Admin"
                  className="font-outfit rounded-md p-0 py-1 text-sm leading-[16px] font-medium"
                  placeholderClassName="font-outfit rounded-md text-xs leading-[21px] font-normal text-black"
                  LabelClassName="text-base leading-[26px] font-medium"
                  label="Role"
                  isMulti={true}
                  options={
                    roleTableData?.data?.map((role: any) => ({
                      value: role.role_name, // keep name
                      label: role.role_name,
                    })) || []
                  }
                />
              )}
            />
          </div>

          {/* Client Handled Field */}
          <div>
            <Controller
              name="clientHandled"
              control={form.control}
              render={({ field }) => (
                <SelectField
                  name="clientHandled"
                  control={form.control}
                  required
                  LabelClassName="pb-3 text-base leading-[26px] font-medium"
                  label="Client Handled"
                  // placeholder="select values"
                  placeholderClassName="font-outfit rounded-md text-xs leading-[21px] font-normal text-black"
                  options={[
                    // { value: '', label: 'Select Clients' },
                    { value: '0-6', label: '0-6' },
                    { value: '7-20', label: '7-20' },
                    { value: '21-50', label: '21-50' },
                    { value: '50-120', label: '50-120' },
                    { value: '120-200', label: '120-200' },
                  ]}
                  className="font-outfit inline-block rounded-md py-1 text-sm leading-[16px] font-medium"
                />
              )}
            />
          </div>

          {/* Day Picker */}
          <div>
            <Label
              className="text-base leading-[26px] font-medium"
              htmlFor="day"
              required
            >
              Day
            </Label>
            <Controller
              control={form.control}
              name="day"
              render={({ field }) => {
                const selectedDays: string[] = Array.isArray(field.value)
                  ? field.value
                  : [];

                const removeDay = (dayToRemove: string) => {
                  field.onChange(selectedDays.filter((d) => d !== dayToRemove));
                };

                return (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger
                      asChild
                      className="border-grey-light h-[44px] px-4 text-xs leading-[21px] hover:bg-transparent"
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-between text-xs leading-[21px] font-normal text-black"
                      >
                        {selectedDays.length > 0 ? (
                          <span className="flex flex-wrap gap-1">
                            {selectedDays.map((d) => {
                              const day = weekDays.find(
                                (day) => day.toLowerCase() === d,
                              );
                              return (
                                <span
                                  key={d}
                                  className="flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs"
                                >
                                  {day?.substring(0, 3)}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation(); // prevent popover from opening
                                      removeDay(d);
                                    }}
                                    className="text-gray-500 hover:text-red-500"
                                  >
                                    ✕
                                  </button>
                                </span>
                              );
                            })}
                          </span>
                        ) : (
                          'Select days'
                        )}
                        <Icons.ri_calendar_line />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <ToggleGroup
                        type="multiple"
                        className="border-grey-light flex w-full gap-7 border px-3"
                        value={selectedDays}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      >
                        {weekDays.map((day) => (
                          <ToggleGroupItem
                            key={day}
                            className="data-[state=on]:bg-brand-primary data-[state=on]:hover:bg-brand-primary rounded-[4px] px-[15px] py-[2px] data-[state=on]:border data-[state=on]:text-white"
                            value={day.toLowerCase()}
                          >
                            {day.substring(0, 3)}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </PopoverContent>
                  </Popover>
                );
              }}
            />
          </div>

          {/* Shift Field */}
          <div>
            <Label
              className="text-base leading-[26px] font-medium"
              htmlFor="day"
              required
            >
              Shift
            </Label>
            <Controller
              name="shift"
              control={form.control}
              render={({ field }) => (
                <ToggleGroup
                  type="single"
                  className="border-grey-light flex w-full gap-7 border px-[13px] py-1"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <ToggleGroupItem
                    className="data-[state=on]:bg-brand-primary data-[state=on]:hover:bg-brand-primary rounded-[4px] px-[15px] py-[2px] text-xs leading-[21px] font-normal data-[state=on]:border data-[state=on]:text-white"
                    value="morning"
                  >
                    Morning
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    className="data-[state=on]:bg-brand-primary data-[state=on]:hover:bg-brand-primary rounded-[4px] px-[15px] py-[2px] data-[state=on]:border data-[state=on]:text-white"
                    value="day"
                  >
                    Day
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    className="data-[state=on]:bg-brand-primary data-[state=on]:hover:bg-brand-primary rounded-[4px] px-[15px] py-[2px] data-[state=on]:border data-[state=on]:text-white"
                    value="night"
                  >
                    Night
                  </ToggleGroupItem>
                </ToggleGroup>
              )}
            />
          </div>

          {/* Work Schedule */}
          <div className="col-span-full">
            <Label
              htmlFor="Workschedule"
              className="text-base leading-[26px] font-medium"
              required
            >
              Work Schedule
            </Label>
            <div className="flex w-[100%] basis-full gap-[26px]">
              <div className="relative w-full">
                <InputField
                  name="startTime"
                  control={form.control}
                  placeholder="8"
                  inputClassName="!text-xs leading-[21px] font-normal"
                  labelClassName="text-base leading-[26px] font-medium"
                  label="Start Time"
                  required
                />
                <div>
                  <Icons.ri_time_line
                    className="absolute top-[60%] right-2"
                    onClick={() => setOpenStartTime(true)}
                  />
                  {/* add agennt button */}
                  <AgentInviteModal
                    open={openStartTime}
                    onOpenChange={setOpenStartTime}
                    dialogClass="gap-0 !max-w-[335px] !border-theme-text-light !w-full !rounded-[0.86px] !shadow-[0px_4.55px_4.55px_0px_#00000040] p-8"
                  >
                    <TimePicker
                      onClose={() => setOpenStartTime(false)}
                      setFieldValue={(val: string) =>
                        form.setValue('startTime', val)
                      }
                    />
                  </AgentInviteModal>
                </div>
              </div>
              <div className="relative w-full">
                <InputField
                  name="endTime"
                  control={form.control}
                  placeholder="8"
                  inputClassName="!text-xs leading-[21px] font-normal"
                  label="End Time"
                  labelClassName=" text-base leading-[26px] font-medium"
                  required
                />
                <Icons.ri_time_line
                  className="absolute top-[60%] right-2"
                  onClick={() => setOpenEndTime(true)}
                />
                {/* add agennt button */}
                <AgentInviteModal
                  open={openEndTime}
                  onOpenChange={setOpenEndTime}
                  dialogClass="gap-0 !max-w-[335px] !border-theme-text-light !w-full !rounded-[0.86px] !shadow-[0px_4.55px_4.55px_0px_#00000040] p-8"
                >
                  <TimePicker
                    onClose={() => setOpenEndTime(false)}
                    setFieldValue={(val: string) =>
                      form.setValue('endTime', val)
                    }
                  />
                </AgentInviteModal>
              </div>
              <div className="w-full">
                <InputField
                  name="totalHours"
                  control={form.control}
                  placeholder="8"
                  inputClassName="!text-xs leading-[21px] font-normal"
                  label="Total Hours"
                  labelClassName="text-base leading-[26px] font-mediumF"
                  // value={totalHours}
                  required
                />
              </div>
            </div>
          </div>

          {/* Team Selection */}
          <div className="col-span-full">
            <Label
              className="text-base leading-[26px] font-medium"
              htmlFor="team"
              required
            >
              Team
            </Label>
            <Controller
              name="team"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    if (value === 'add_team') {
                      setOpenInviteMember(true);
                      field.onChange('');
                    } else {
                      field.onChange(value);
                    }
                  }}
                >
                  <SelectTrigger className="border-gray-light font-outfit w-full rounded-md border text-xs leading-[21px] font-normal !text-black">
                    <SelectValue className="" placeholder="Select Team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/* teamsData?.data?.map((teamsDataItems: any) => ({ */}
                      {teamsData?.data?.map((team: any) => (
                        <SelectItem key={team.id} value={team.name}>
                          <span className="font-outfit rounded-md px-3 py-1 text-sm leading-[16px] font-medium">
                            {team.name}
                          </span>
                        </SelectItem>
                      ))}
                      <SelectItem value="add_team" className="bg-brand-primary">
                        <span className="font-outfit rounded-md px-3 py-1 text-sm leading-[16px] font-medium">
                          Add Team
                        </span>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

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
