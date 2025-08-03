import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Icons } from '@/components/ui/Icons';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { InputField } from '@/components/common/hook-form/InputField';
import Label from '@/components/common/hook-form/Label';
import { SelectField } from '@/components/common/hook-form/SelectField';
import { Form } from '@/components/ui/form';

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

interface AddAgentProps {
  defaultValues: Partial<FormValues>;
  onSubmit: (data: FormValues) => void;
  submitButton: string;
}

const AddAgent: React.FC<AddAgentProps> = ({
  defaultValues,
  onSubmit,
  submitButton,
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
    },
  });
  // states
  const [open, setOpen] = React.useState(false);

  // day picker data
  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {/* Input Fields */}

          {/* Enter agent’s Email * */}
          <div>
            <Label
              required
              className="pb-3 text-base leading-[26px] font-medium" //
              htmlFor="email"
            >
              Enter agent’s Email
            </Label>
            <InputField name="email" control={form.control} />
          </div>

          {/* Full Name  * */}
          <div>
            <Label
              className="pb-3 text-base leading-[26px] font-medium" //
              htmlFor="fullName"
              required
            >
              Full Name 
            </Label>
            <InputField name="fullName" control={form.control} />
          </div>

          {/* Dropdown: Role */}
          <div>
            <Label
              className="pb-3 text-base leading-[26px] font-medium" //
              htmlFor="role"
              required
            >
              Roles
            </Label>
            <SelectField
              name="role"
              required
              control={form.control}
              placeholder="Admin"
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'agent', label: 'Agent' },
                { value: 'moderator', label: 'Moderator' },
                { value: 'lead', label: 'Lead' },
              ]}
            />
          </div>

          {/* Dropdown: Client Handled */}
          <div>
            <Label
              className="pb-3 text-base leading-[26px] font-medium" //
              htmlFor="clientHandled"
              required
            >
              Client Handled
            </Label>
            <SelectField
              name="clientHandled"
              required
              placeholder="0-6"
              control={form.control}
              className="text-red-400"
              options={[
                { value: 'client1', label: '0-6' },
                { value: 'client2', label: '7-20' },
                { value: 'client3', label: '21-50' },
                { value: 'client4', label: '50-120' },
                { value: 'client5', label: '120-200' },
              ]}
            />
          </div>

          {/* form day picker  */}

          <Controller
            control={form.control}
            name="day"
            render={({ field }) => (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal text-black"
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
                    className="border-grey-light flex w-full gap-7 border px-[13px] py-1"
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
                        value={day.toLowerCase()} // lowercase or as you prefer for form values
                      >
                        {day.substring(0, 3)}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </PopoverContent>
              </Popover>
            )}
          />

          {/* <div>
          <Label
            className="pb-3 text-base leading-[26px] font-medium" //
            htmlFor="day"
            required
          >
            Day
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <span id="date" className="w-full justify-between font-normal">
                <Button
                  variant="outline"
                  id="date"
                  className="border-grey-light !hover:bg-transparent w-full justify-between font-normal text-black"
                >
                  {date ? date.toLocaleDateString() : 'Pick a date'}
                  <Icons.ri_calendar_line />
                </Button> */}
          {/* <ChevronDownIcon /> */}
          {/* </span>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDate(date);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div> */}

          {/* Toggle Group */}
          {/* <div>
          <Label
            className="pb-3 text-base leading-[26px] font-medium" //
            htmlFor="shift"
            required
          >
            Shift 
          </Label>
          <ToggleGroup
            type="single"
            className="border-grey-light flex w-full gap-7 border px-[13px] py-1"
          >
            <ToggleGroupItem
              className="data-[state=on]:bg-brand-primary data-[state=on]:hover:bg-brand-primary rounded-[4px] px-[15px] py-[2px] data-[state=on]:border data-[state=on]:text-white"
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
        </div> */}

          {/* time shift field */}

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
                  className="data-[state=on]:bg-brand-primary data-[state=on]:hover:bg-brand-primary rounded-[4px] px-[15px] py-[2px] data-[state=on]:border data-[state=on]:text-white"
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

          {/* Work Schedule   */}
          <div className="col-span-full">
            <Label
              htmlFor="Workschedule"
              className="text-base leading-[26px] font-medium"
              required
            >
              Work Schedule
            </Label>

            <div className="flex w-[100%] basis-full gap-[26px]">
              {/* start time */}
              <div className="w-full">
                <Label
                  className="pb-3 text-base leading-[26px] font-medium" //
                  htmlFor="startTime"
                  required
                >
                  Start Time
                </Label>
                <InputField
                  type="time"
                  name="startTime"
                  control={form.control}
                  required
                  className="!w-[100%]"
                />
              </div>

              {/* end time */}
              <div className="w-full">
                <Label
                  className="pb-3 text-base leading-[26px] font-medium" //
                  htmlFor="endTime"
                  required
                >
                  End Time
                </Label>
                <InputField
                  type="time"
                  name="endTime"
                  control={form.control}
                  required
                  className="!w-[100%]"
                />
              </div>

              {/*toatl hours: Input Fields */}
              <div className="w-full">
                <Label
                  className="pb-3 text-base leading-[26px] font-medium" //
                  htmlFor="totalHours"
                  required
                >
                  Total Hours
                </Label>
                <InputField
                  name="totalHours"
                  control={form.control}
                  placeholder="8"
                  //   control={form.control}
                  //   label="Enter agent’s Email"
                />
              </div>
            </div>
          </div>

          {/* dropdown team */}
          <div className="col-span-full">
            <Label
              className="pb-3 text-base leading-[26px] font-medium" //
              htmlFor="team"
              required
            >
              Team
            </Label>
            <SelectField
              name="team"
              required
              control={form.control}
              placeholder="Select Team"
              options={[
                { value: 'team1', label: 'Team 1' },
                { value: 'team2', label: 'Team 2' },
                { value: 'team3', label: 'Team 3' },
                { value: 'team4', label: 'Team 4' },
                { value: 'add_team', label: 'Add Team' },
              ]}
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
    </>
  );
};

export default AddAgent;
