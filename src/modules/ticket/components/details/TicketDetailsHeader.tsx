'use client';

import { parseISO, addMinutes, format } from 'date-fns';
import { Icons } from '@/components/ui/Icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTicketHeaderLogic } from './logic/useTicketDetailsHeaderLogic';

interface TicketDetailsHeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  ticketId: number;
  onUpdateTicket: (updatedTicket: any) => void;
  ticket: any;
}

export default function TicketDetailsHeader({
  sidebarOpen,
  toggleSidebar,
  ticketId,
  onUpdateTicket,
  ticket,
}: TicketDetailsHeaderProps) {
  const {
    priorityId,
    statusId,
    agent,
    assignees,
    priorities,
    statuses,
    setAgent,
    handlePriorityChange,
    handleStatusChange,
  } = useTicketHeaderLogic(ticketId, onUpdateTicket);

  if (!ticket) return <p>Loading ticket details...</p>;

  const formattedDateNepal = format(
    addMinutes(parseISO(ticket.created_at), 345),
    'EEEE, dd MMMM yyyy, hh:mm:ss a',
  );

  return (
    <div className="border-theme-text-light flex items-center justify-between border-b py-3">
      <div className="pl-5">
        <h3 className="font-outfit text-brand-dark text-xl font-semibold">
          {ticket.title || 'Untitled Ticket'}
        </h3>
        <p className="font-outfit text-gray-primary text-xs font-normal">
          Ticket{' '}
          <span className="text-brand-primary cursor-pointer font-medium hover:underline">
            #{ticket.id}
          </span>{' '}
          created from {ticket.customer_name} on {formattedDateNepal}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Status */}
        <Select
          value={statusId}
          onValueChange={(newId) => {
            handleStatusChange(newId); // debounced PATCH API
            const newStatus = (statuses || []).find(
              (s) => s.id.toString() === newId,
            );
            if (newStatus) onUpdateTicket({ status: newStatus }); // UI update
          }}
        >
          <SelectTrigger className="text-brand-dark font-outfit w-auto min-w-[104px] cursor-pointer px-2 text-xs font-semibold">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="text-brand-dark font-outfit hover:text-brand-dark cursor-pointer text-xs font-normal">
            {(statuses || []).map((s) => (
              <SelectItem key={s.id} value={s.id.toString()}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority */}
        <Select
          value={priorityId}
          onValueChange={(newId) => {
            handlePriorityChange(newId); // debounced PATCH API
            const newPriority = (priorities || []).find(
              (p) => p.id.toString() === newId,
            );
            if (newPriority) onUpdateTicket({ priority: newPriority }); // UI update
          }}
        >
          <SelectTrigger className="text-brand-dark font-outfit w-auto min-w-[104px] cursor-pointer px-2 text-xs font-semibold">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="text-brand-dark font-outfit hover:text-brand-dark cursor-pointer text-xs font-normal">
            {(priorities || []).map((p: any) => (
              <SelectItem key={p.id} value={p.id.toString()}>
                {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Agent */}
        <Select value={agent} onValueChange={setAgent}>
          <SelectTrigger className="text-brand-dark font-outfit w-auto min-w-[104px] cursor-pointer px-2 text-xs font-semibold">
            <SelectValue placeholder="Agent" />
          </SelectTrigger>
          <SelectContent className="text-brand-dark font-outfit hover:text-brand-dark cursor-pointer text-xs font-normal">
            {assignees.length > 0 ? (
              assignees.map((a) => (
                <SelectItem key={a.name} value={a.name}>
                  {a.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value={ticket.created_by.name}>
                {ticket.created_by.name}
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        {/* Sidebar Toggle */}
        <button onClick={toggleSidebar} className="pr-6">
          <Icons.chevron_left
            className={`h-6 w-6 text-purple-800 transition-transform duration-200 ${
              sidebarOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );
}
