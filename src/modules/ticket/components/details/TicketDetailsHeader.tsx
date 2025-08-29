'use client';

import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronRight } from 'lucide-react';
import { getTicketDetails } from '@/services/ticket/services';

interface TicketDetailsHeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  ticketId: number;
}

export default function TicketDetailsHeader({
  sidebarOpen,
  toggleSidebar,
  ticketId,
}: TicketDetailsHeaderProps) {
  const [ticket, setTicket] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [agent, setAgent] = useState('');
  const [assignees, setAssignees] = useState<{ name: string }[]>([]);

  useEffect(() => {
    if (!ticketId) return;

    const fetchTicket = async () => {
      try {
        const response = await getTicketDetails(ticketId);
        const data = response.data;
        setTicket(data);

        // Set status, priority
        setStatus(data.status?.name || '');
        setPriority(data.priority?.name || '');

        // Set assignees
        setAssignees(data.assignees || []);
        if (data.assignees && data.assignees.length > 0) {
          setAgent(data.assignees[0].name); // default first assignee
        } else if (data.created_by) {
          setAgent(data.created_by.name); // fallback to creator
        }
      } catch (error) {
        console.error('Failed to fetch ticket details', error);
      }
    };

    fetchTicket();
  }, [ticketId]);

  if (!ticket) return <p>Loading ticket details...</p>;

  return (
    <div className="border-theme-text-light flex items-center justify-between border-b px-4 py-3">
      {/* Left Side */}
      <div>
        <h3 className="font-outfit text-brand-dark text-xl font-semibold">
          {ticket.title || 'Untitled Ticket'}
        </h3>
        <p className="font-outfit text-gray-primary text-xs font-normal">
          Ticket{' '}
          <span className="text-brand-primary cursor-pointer font-medium hover:underline">
            #{ticket.id}
          </span>{' '}
          created by {ticket.customer_name} on{' '}
          {new Date(ticket.created_at).toLocaleString(undefined, {
            weekday: 'long', // Monday, Tuesday, etc.
            year: 'numeric',
            month: 'long', // January, February, etc.
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true, // 12-hour format
          })}
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Status */}
        <Select value={status} onValueChange={setStatus}>
          {' '}
          <SelectTrigger className="w-[100px] font-medium text-purple-900">
            {' '}
            <SelectValue placeholder="Status" />{' '}
          </SelectTrigger>{' '}
          <SelectContent>
            {' '}
            <SelectItem value="Open">Open</SelectItem>{' '}
            <SelectItem value="Closed">Closed</SelectItem>{' '}
            <SelectItem value="Pending">Pending</SelectItem>{' '}
            {/* If API returns 'Unassigned', include it */}{' '}
            {ticket.status?.name &&
              !['Open', 'Closed', 'Pending'].includes(ticket.status.name) && (
                <SelectItem value={ticket.status.name}>
                  {' '}
                  {ticket.status.name}{' '}
                </SelectItem>
              )}{' '}
          </SelectContent>{' '}
        </Select>

        {/* Priority */}
        <Select value={priority} onValueChange={setPriority}>
          {' '}
          <SelectTrigger className="w-[100px] font-medium text-purple-900">
            {' '}
            <SelectValue placeholder="Priority" />{' '}
          </SelectTrigger>{' '}
          <SelectContent>
            {' '}
            <SelectItem value="Low">Low</SelectItem>{' '}
            <SelectItem value="Medium">Medium</SelectItem>{' '}
            <SelectItem value="Urgent">Urgent</SelectItem>{' '}
            {/* Show API priority if not in default list */}{' '}
            {ticket.priority?.name &&
              !['Low', 'Medium', 'Urgent'].includes(ticket.priority.name) && (
                <SelectItem value={ticket.priority.name}>
                  {' '}
                  {ticket.priority.name}{' '}
                </SelectItem>
              )}{' '}
          </SelectContent>{' '}
        </Select>

        {/* Agent */}
        <Select value={agent} onValueChange={setAgent}>
          <SelectTrigger className="w-[140px] font-medium text-purple-900">
            <SelectValue placeholder="Agent" />
          </SelectTrigger>
          <SelectContent>
            {assignees.length > 0 ? (
              assignees.map((assignee) => (
                <SelectItem key={assignee.name} value={assignee.name}>
                  {assignee.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value={ticket.created_by.name}>
                {ticket.created_by.name}
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        <button onClick={toggleSidebar} className="pr-6">
          <ChevronRight
            className={`h-6 w-6 text-purple-800 transition-transform duration-200 ${
              sidebarOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );
}
