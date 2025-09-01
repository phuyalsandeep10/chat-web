'use client';

import { useEffect, useState } from 'react';
import { getTicketDetails } from '@/services/ticket/services';
import { Icons } from '@/components/ui/Icons';
import { parseISO, addMinutes, format, formatDistanceToNow } from 'date-fns';

import { TicketGeneralInfo } from './TicketGeneralInformation';
import TicketDetailsSla from './TicketDetailsSla';

interface TicketRightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: number;
}

export default function TicketRightSidebar({
  isOpen,
  onClose,
  ticketId,
}: TicketRightSidebarProps) {
  const [ticket, setTicket] = useState<any>(null);

  useEffect(() => {
    if (!ticketId) return;

    const fetchTicket = async () => {
      try {
        const response = await getTicketDetails(ticketId);
        setTicket(response.data);
      } catch (error) {
        console.error('Failed to fetch ticket details', error);
      }
    };

    fetchTicket();
  }, [ticketId]);

  if (!ticket) return <p className="p-4">Loading ticket details...</p>;

  //  Convert UTC string → Nepal Time + add "time ago"
  const formatDate = (
    utcString: string | null,
    mode: 'full' | 'ago' = 'full',
  ) => {
    if (!utcString) return 'N/A';
    const nepalDate = addMinutes(parseISO(utcString), 345);

    if (mode === 'ago') {
      // remove "about " if present
      return formatDistanceToNow(nepalDate, { addSuffix: true }).replace(
        /^about\s/,
        '',
      );
    }

    return format(nepalDate, 'EEEE, dd MMMM yyyy, hh:mm:ss a');
  };

  return (
    <div
      className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-[400px] flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header (sticky) */}
      <div className="border-gray-light px- sticky top-0 z-10 flex flex-shrink-0 items-center justify-between border-b bg-white py-7">
        <h3 className="font-outfit text-xl font-semibold">
          Ticket Information
        </h3>
        <button onClick={onClose}>
          <Icons.x className="text-gray-primary h-6 w-6" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 space-y-8 overflow-y-auto px-10 pt-4">
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

        {/* General Information */}
        <TicketGeneralInfo ticketId={ticket.id} data={ticket} />

        {/* SLA */}

        <TicketDetailsSla ticket={ticket} />

        {/* Department */}
        <div>
          <h4 className="font-semibold">Department</h4>
          <p>{ticket.department?.name || 'N/A'}</p>
        </div>

        {/* Created By */}
        <div>
          <h4 className="font-semibold">Created By</h4>
          <p>
            {ticket.created_by?.name} ({ticket.created_by?.email})
          </p>
        </div>

        {/* Dates */}
        <div className="flex flex-col gap-2">
          <div>
            <h4 className="font-semibold">Created At</h4>
            <p>{formatDate(ticket.created_at)}</p>
          </div>
          <div>
            <h4 className="font-semibold">Opened At</h4>
            <p>{formatDate(ticket.opened_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
