'use client';

import { useEffect, useState } from 'react';
import { X, Copy, Edit2 } from 'lucide-react';
import { getTicketDetails } from '@/services/ticket/services';
import { Icons } from '@/components/ui/Icons';

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

  const formatDate = (utcString: string | null) =>
    utcString
      ? new Date(utcString).toLocaleString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      : 'N/A';

  // Editable Field Component
  const EditableField = ({
    label,
    value,
    type = 'text',
  }: {
    label: string;
    value: string;
    type?: string;
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [fieldValue, setFieldValue] = useState(value);

    const handleCopy = () => {
      navigator.clipboard.writeText(fieldValue);
      alert(`${label} copied to clipboard!`);
    };

    const handleEditToggle = () => setIsEditing(!isEditing);

    return (
      <div className="flex w-full items-center gap-2">
        <p className="w-[80px] font-medium">{label}:</p>
        {isEditing ? (
          <input
            type={type}
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            className="flex-1 rounded border border-gray-300 px-2 py-1"
          />
        ) : (
          <p
            className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
            title={fieldValue}
          >
            {fieldValue || 'N/A'}
          </p>
        )}
        <div className="flex flex-shrink-0 gap-1">
          <button
            onClick={handleEditToggle}
            className="rounded bg-blue-100 p-1 text-blue-700 hover:bg-blue-200"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleCopy}
            className="rounded bg-green-100 p-1 text-green-700 hover:bg-green-200"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`fixed top-0 right-0 z-50 h-full w-[400px] flex-col bg-white shadow-lg transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-4 py-5">
        <h3 className="text-lg font-semibold">Ticket Information</h3>
        <button onClick={onClose}>
          <X className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 space-y-6 overflow-y-auto p-4 pl-6">
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
            <p>{formatDate(ticket.created_at)}</p>
          </div>
        </div>

        {/* General Information */}
        <div className="border-0.5 border-gray-primary flex flex-col gap-2 border p-2">
          <h4 className="font-outfit text-brand-dark flex items-center gap-2 text-xl font-semibold">
            <Icons.client className="h-5 w-5" />
            General Information
          </h4>
          <EditableField label="Name" value={ticket.customer_name} />
          <EditableField
            label="Email"
            value={ticket.customer_email}
            type="email"
          />
          <EditableField
            label="Phone"
            value={ticket.customer_phone}
            type="tel"
          />
          <EditableField label="Location" value={ticket.customer_location} />
        </div>

        {/* SLA */}
        <div>
          <h4 className="font-semibold">SLA</h4>
          <p>{ticket.sla?.name || 'N/A'}</p>
        </div>

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

        {/* Assignees */}
        <div>
          <h4 className="font-semibold">Assignees</h4>
          {ticket.assignees.length > 0 ? (
            <ul className="list-disc pl-5">
              {ticket.assignees.map((assignee: any) => (
                <li key={assignee.name}>{assignee.name}</li>
              ))}
            </ul>
          ) : (
            <p>None</p>
          )}
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
