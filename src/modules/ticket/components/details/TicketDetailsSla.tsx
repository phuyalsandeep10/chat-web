'use client';

import { Icons } from '@/components/ui/Icons';
import React, { useEffect, useState } from 'react';
import { parseISO, addMinutes, formatDistanceToNow } from 'date-fns';
import { getConversation } from '@/services/ticket/conversation';

interface TicketDetailsSlaProps {
  ticket: any;
}

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

const toNepaliDate = (isoDate: string) => addMinutes(parseISO(isoDate), 345);

export const TicketDetailsSla: React.FC<TicketDetailsSlaProps> = ({
  ticket,
}) => {
  const [lastAgentDate, setLastAgentDate] = useState<Date | null>(null);
  const [lastCustomerDate, setLastCustomerDate] = useState<Date | null>(null);
  const [now, setNow] = useState<Date>(new Date());

  // Live "time ago" every 3s
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 3000);
    return () => clearInterval(interval);
  }, []);

  // Refetch conversations whenever ticket changes
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

        setLastAgentDate(
          agentMessages.length
            ? toNepaliDate(agentMessages.at(-1).created_at)
            : null,
        );
        setLastCustomerDate(
          customerMessages.length
            ? toNepaliDate(customerMessages.at(-1).created_at)
            : null,
        );
      } catch (err) {
        console.error('Failed to fetch conversation', err);
      }
    };

    fetchLastReplies();
  }, [ticket]);

  if (!ticket) return <p className="p-4">Loading SLA details...</p>;

  return (
    <div className="border-0.5 border-gray-primary rounded-md border">
      <h1 className="font-outfit text-brand-dark my-4 ml-4 flex items-center gap-2 text-xl font-semibold">
        <span>
          <Icons.vector />
        </span>
        SLA Details
      </h1>
      <div className="mx-4 mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="font-outfit text-brand-dark border-gray-light flex-col justify-between rounded-md border p-2 text-sm font-medium">
          <h1 className="mb-3">Ticket ID</h1>
          <p className="text-black">#{ticket.id}</p>
        </div>
        <div className="font-outfit text-brand-dark border-gray-light flex-col justify-between rounded-md border p-2 text-sm font-medium">
          <h1 className="mb-3">SLA Policy</h1>
          <p className="text-black">{ticket.sla?.name || 'N/A'}</p>
        </div>
        <div className="font-outfit text-brand-dark border-gray-light flex-col justify-between rounded-md border p-2 text-sm font-medium">
          <h1 className="mb-3">Response Time</h1>
          <p className="text-black">
            {formatSlaTime(ticket.sla?.response_time)}
          </p>
        </div>
        <div className="font-outfit text-brand-dark border-gray-light flex-col justify-between rounded-md border p-2 text-sm font-medium">
          <h1 className="mb-3">Resolution Time</h1>
          <p className="text-black">
            {formatSlaTime(ticket.sla?.resolution_time)}
          </p>
        </div>
        <div className="font-outfit text-brand-dark border-gray-light flex-col justify-between rounded-md border p-2 text-sm font-medium">
          <h1 className="mb-3">Last Agent Reply</h1>
          <p className="text-black">
            {lastAgentDate
              ? formatDistanceToNow(lastAgentDate, { addSuffix: true }).replace(
                  /^about\s/,
                  '',
                )
              : 'N/A'}
          </p>
        </div>
        <div className="font-outfit text-brand-dark border-gray-light flex-col justify-between rounded-md border p-2 text-sm font-medium">
          <h1 className="mb-3">Last Customer Reply</h1>
          <p className="text-black">
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
