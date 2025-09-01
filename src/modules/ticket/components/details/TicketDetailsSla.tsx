'use client';
import { Icons } from '@/components/ui/Icons';
import React, { useEffect, useState } from 'react';
import { parseISO, addMinutes, formatDistanceToNow } from 'date-fns';
import { getConversation } from '@/services/ticket/conversation';

interface TicketDetailsSlaProps {
  ticket: any; // Replace with proper type if available
}

// ✅ Format SLA time from seconds → human-readable (Xd Xh Xm)
const formatSlaTime = (seconds: number | undefined | null) => {
  if (seconds == null) return 'N/A';

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
};

// ✅ Convert UTC → Nepal time Date object
const toNepaliDate = (isoDate: string) => {
  const date = parseISO(isoDate);
  return addMinutes(date, 345); // +5:45 offset
};

const TicketDetailsSla: React.FC<TicketDetailsSlaProps> = ({ ticket }) => {
  const [lastAgentDate, setLastAgentDate] = useState<Date | null>(null);
  const [lastCustomerDate, setLastCustomerDate] = useState<Date | null>(null);
  const [now, setNow] = useState<Date>(new Date());

  // ⏱ keep updating current time every 30s for live "time ago"
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30000); // update every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!ticket?.id) return;

    const fetchLastReplies = async () => {
      try {
        const response = await getConversation(ticket.id);
        const messages = response.data;

        const agentMessages = messages.filter(
          (msg: any) => msg.direction === 'outgoing',
        );
        const customerMessages = messages.filter(
          (msg: any) => msg.direction === 'incoming',
        );

        const lastAgent = agentMessages[agentMessages.length - 1];
        const lastCustomer = customerMessages[customerMessages.length - 1];

        if (lastAgent) setLastAgentDate(toNepaliDate(lastAgent.created_at));
        if (lastCustomer)
          setLastCustomerDate(toNepaliDate(lastCustomer.created_at));
      } catch (error) {
        console.error('Failed to fetch conversation', error);
      }
    };

    fetchLastReplies();
  }, [ticket]);

  if (!ticket) return <p className="p-4">Loading SLA details...</p>;

  return (
    <div className="border-0.5 border-gray-primary border">
      <h1 className="font-outfit text-brand-dark my-4 ml-4 flex items-center gap-2 text-xl font-semibold">
        <span>
          <Icons.vector />
        </span>
        SLA Details
      </h1>

      <div className="mx-4 mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="font-outfit text-brand-dark border-gray-light flex-col justify-between rounded-md border p-2 text-sm font-medium">
          <h1 className="mb-3">Ticket ID</h1>
          <p>#{ticket.id}</p>
        </div>

        <div className="font-outfit text-brand-dark border-gray-light flex-col justify-between rounded-md border p-2 text-sm font-medium">
          <h1 className="mb-3">SLA Policy</h1>
          <p>{ticket.sla?.name || 'N/A'}</p>
        </div>

        <div className="font-outfit text-brand-dark border-gray-light flex-col justify-between rounded-md border p-2 text-sm font-medium">
          <h1 className="mb-3">Response Time</h1>
          <p>{formatSlaTime(ticket.sla?.response_time)}</p>
        </div>

        <div className="font-outfit text-brand-dark border-gray-light flex-col justify-between rounded-md border p-2 text-sm font-medium">
          <h1 className="mb-3">Resolution Time</h1>
          <p>{formatSlaTime(ticket.sla?.resolution_time)}</p>
        </div>

        <div className="font-outfit text-brand-dark border-gray-light flex-col justify-between rounded-md border p-2 text-sm font-medium">
          <h1 className="mb-3">Last Agent Reply</h1>
          <p>
            {lastAgentDate
              ? formatDistanceToNow(lastAgentDate, {
                  addSuffix: true,
                }).replace(/^about\s/, '')
              : 'N/A'}
          </p>
        </div>

        <div className="font-outfit text-brand-dark border-gray-light flex-col justify-between rounded-md border p-2 text-sm font-medium">
          <h1 className="mb-3">Last Customer Reply</h1>
          <p>
            {lastCustomerDate
              ? formatDistanceToNow(lastCustomerDate, {
                  addSuffix: true,
                }).replace(/^about\s/, '')
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsSla;
