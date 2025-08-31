'use client';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { TicketCardProps } from '@/modules/ticket/types/type';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function TicketCard({
  email,
  timeAgo,
  title,
  priority,
  status,
  created_by,
  assignees = [],
  checked = false,
  onCheckChange,
  priority_bg_color,
  priority_fg_color,
  status_fg_color,
  status_bg_color,
}: TicketCardProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col overflow-hidden rounded-lg bg-white shadow-md sm:flex-row',
      )}
    >
      {/* Left Vertical Badge */}
      <div
        className={cn(
          'relative flex h-[60px] w-12 items-center justify-center sm:h-auto',
        )}
        style={{
          backgroundColor: status_bg_color,
        }}
      >
        {/* White Circle */}
        <div className="absolute top-1/2 left-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />

        {/* Rotated Status Text */}
        <span
          className="text-xl font-bold whitespace-nowrap text-white sm:-rotate-90"
          style={{ color: status_fg_color }}
        >
          {status}
        </span>
      </div>

      {/* Main Content */}
      <div className="flex w-full flex-col gap-2 p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Email & Creator Info */}
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onClick={(e) => e.stopPropagation()} // ⬅ prevent parent click
                  onChange={(e) => onCheckChange?.(e.target.checked)}
                  className="accent-brand-primary h-4 w-4 cursor-pointer"
                />
                <p className="font-outfit w-[160px] text-sm leading-[21px] font-normal break-words whitespace-normal">
                  {email}
                </p>
              </div>
              <p className="font-outfit text-theme-text-primary pt-1 text-xs leading-[17px] font-normal break-words whitespace-normal">
                Created from {created_by}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2">
            <span className="font-outfit text-gray-primary text-base leading-[26px] font-normal">
              {timeAgo}
            </span>
            {/* Avatars */}
            <div className="flex -space-x-4">
              {assignees.map((assignee) => (
                <Tooltip key={assignee.id}>
                  <TooltipTrigger asChild>
                    <Avatar className="h-10.5 w-10.5 cursor-pointer border-2 border-white">
                      {assignee.image ? (
                        <AvatarImage src={assignee.image} alt={assignee.name} />
                      ) : (
                        <AvatarFallback>
                          {assignee.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="font-outfit text-xs">
                    {assignee.name}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>

        {/* Title */}
        <p className="font-outfit text-gray-g pb-3 text-2xl leading-[34px] font-semibold break-words whitespace-normal">
          {title}
        </p>

        {/* Priority Badge */}
        {priority ? (
          <Badge
            className="font-outfit w-full justify-center rounded-full py-2 text-xs leading-[20px] font-bold"
            style={{
              backgroundColor: priority_bg_color,
              color: priority_fg_color,
            }}
          >
            {priority}
          </Badge>
        ) : (
          <span className="font-outfit bg-alert-prominent flex w-full items-center justify-center rounded-full py-2 text-xs font-bold text-white">
            Priority Not Set
          </span>
        )}
      </div>
    </div>
  );
}
