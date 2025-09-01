import React, { useState } from 'react';
import Label from '@/components/common/hook-form/Label';
import { Controller } from 'react-hook-form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { FieldProps } from '../types';

const DayField: React.FC<FieldProps> = ({ control }) => {
  const [open, setOpen] = useState(false);

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
    <div>
      <Label
        className="text-base leading-[26px] font-medium"
        htmlFor="day"
        required
      >
        Day
      </Label>
      <Controller
        control={control}
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
  );
};

export default DayField;
