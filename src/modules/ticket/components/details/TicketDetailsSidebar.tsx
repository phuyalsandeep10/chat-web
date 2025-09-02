'use client';

import { Icons } from '@/components/ui/Icons';
import { parseISO, addMinutes, format, formatDistanceToNow } from 'date-fns';
import { TicketGeneralInfo } from './TicketGeneralInformation';
import { TicketDetailsSla } from './TicketDetailsSla';
import Notes from './Note';

interface TicketRightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
}

export default function TicketRightSidebar({
  isOpen,
  onClose,
  ticket,
}: TicketRightSidebarProps) {
  if (!ticket) return <p className="p-4">Loading ticket details...</p>;

  const formatDate = (
    utcString: string | null,
    mode: 'full' | 'ago' = 'full',
  ) => {
    if (!utcString) return 'N/A';
    const nepalDate = addMinutes(parseISO(utcString), 345);

    if (mode === 'ago') {
      return formatDistanceToNow(nepalDate, { addSuffix: true }).replace(
        /^about\s/,
        '',
      );
    }

    return format(nepalDate, 'EEEE, dd MMMM yyyy, hh:mm:ss a');
  };

  return (
    <div
      className={`fixed top-0 right-0 flex h-full w-full max-w-[400px] flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="border-gray-light sticky top-0 flex flex-shrink-0 items-center justify-between border-b bg-white px-10 py-7">
        <h3 className="font-outfit text-xl font-semibold">
          Ticket Information
        </h3>
        <button onClick={onClose}>
          <Icons.x className="text-gray-primary h-6 w-6" />
        </button>
      </div>

      {/* Content */}
      <div className="mb-8 flex-1 space-y-8 overflow-y-auto border-l px-10 pt-4">
        {/* Priority, Status, Created At */}
        <div className="flex gap-4">
          <div>
            <span
              className="rounded px-2 py-1 text-white"
              style={{
                backgroundColor: ticket.priority?.bg_color || '#000',
                color: ticket.priority?.fg_color || '#fff',
              }}
            >
              {ticket.priority?.name || 'N/A'}
            </span>
          </div>
          <div>
            <span
              className="rounded px-2 py-1 text-white"
              style={{
                backgroundColor: ticket.status?.bg_color || '#000',
                color: ticket.status?.fg_color || '#fff',
              }}
            >
              {ticket.status?.name || 'N/A'}
            </span>
          </div>
          <div>
            <p>Created {formatDate(ticket.created_at, 'ago')}</p>
          </div>
        </div>

        {/* General Info */}
        <TicketGeneralInfo ticketId={ticket.id} data={ticket} />

        {/* SLA */}
        <TicketDetailsSla ticket={ticket} />
        <Notes ticketId={ticket.id} />

        {/* Department */}
      </div>
    </div>
  );
}
