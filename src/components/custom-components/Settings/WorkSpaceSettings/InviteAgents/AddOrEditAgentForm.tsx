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

type FormValues = {
  email: string;
  fullName: string;
  role: string;
  clientHandled: string;
  day: string | null;
  shift: string;
  startTime: string;
  endTime: string;
  totalHours: string;
  team: string;
};

interface AddOrEditAgentFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit?: (data: FormValues) => void;
  submitButton?: string;
  onClose?: () => void;
}

const AddOrEditAgentForm: React.FC<AddOrEditAgentFormProps> = ({
  defaultValues,
  onSubmit,
  submitButton = 'Add Agent',
  onClose,
}) => {
  const form = useForm<FormValues>({
    defaultValues: {
      day: 'sunday',
      shift: 'morning',
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

  const [open, setOpen] = useState(false);
  const [openInviteMember, setOpenInviteMember] = useState(false);
  const [teams, setTeams] = useState([
    { value: 'team1', label: 'Team 1' },
    { value: 'team2', label: 'Team 2' },
    { value: 'team3', label: 'Team 3' },
    { value: 'team4', label: 'Team 4' },
  ]);

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

  const handleAddTeamMember = (data: any) => {
    setOpenInviteMember(false);
  };

  // When savedTime changes, update the appropriate form input value
  useEffect(() => {
    if (savedTime) {
      const formatted = `${savedTime.hours
        .toString()
        .padStart(2, '0')}:${savedTime.minutes
        .toString()
        .padStart(2, '0')} ${savedTime.period}`;

      if (openStartTime) {
        setValue('startTime', formatted);
      } else if (openEndTime) {
        setValue('endTime', formatted);
      }
    }
  }, [savedTime, setValue, openStartTime, openEndTime]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            onSubmit?.(data);
            form.reset();
            onClose?.();
          })}
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
            />
          </div>

          {/* Role Field */}
          <div>
            <Controller
              name="role"
              control={form.control}
              render={({ field }) => (
                <SelectField
                  name="role"
                  required
                  control={form.control}
                  placeholder="Admin"
                  className="font-outfit rounded-md p-0 py-1 text-sm leading-[16px] font-medium"
                  placeholderClassName="font-outfit rounded-md text-xs leading-[21px] font-normal text-black"
                  LabelClassName="text-base leading-[26px] font-medium"
                  label="Role"
                  options={[
                    { value: 'admin', label: 'Admin' },
                    { value: 'agent', label: 'Agent' },
                    { value: 'moderator', label: 'Moderator' },
                    { value: 'lead', label: 'Lead' },
                  ]}
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
                  placeholderClassName="font-outfit rounded-md text-xs leading-[21px] font-normal text-black"
                  options={[
                    { value: '0-6', label: '0-6' },
                    { value: '7-20', label: '7-20' },
                    { value: '21-50', label: '21-50' },
                    { value: '50-120', label: '50-120' },
                    { value: '120-200', label: '120-200' },
                  ]}
                  placeholder="0-6"
                  className="font-outfit rounded-md py-1 text-sm leading-[16px] font-medium"
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
              render={({ field }) => (
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger
                    asChild
                    className="border-grey-light h-[44px] px-4 text-xs leading-[21px] hover:bg-transparent"
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-between text-xs leading-[21px] font-normal text-black"
                    >
                      {field.value
                        ? weekDays.find((d) => d.toLowerCase() === field.value)
                        : 'Sunday'}
                      <Icons.ri_calendar_line />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <ToggleGroup
                      type="single"
                      className="border-grey-light flex w-full gap-7 border px-3"
                      value={field.value ?? undefined}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setOpen(false);
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
              )}
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
                      {teams.map((team) => (
                        <SelectItem key={team.value} value={team.value}>
                          <span className="font-outfit rounded-md px-3 py-1 text-sm leading-[16px] font-medium">
                            {team.label}
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
