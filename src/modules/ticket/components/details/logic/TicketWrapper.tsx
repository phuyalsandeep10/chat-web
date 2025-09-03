'use client';

import { useState, useEffect } from 'react';

import { TicketService } from '@/services/ticket/ticketServices';
import TicketDetailsHeader from '../TicketDetailsHeader';
import TicketRightSidebar from '../TicketDetailsSidebar';
import { TicketDetailsSla } from '../TicketDetailsSla';

interface TicketWrapperProps {
  ticketId: number;
}

export default function TicketWrapper({ ticketId }: TicketWrapperProps) {
  const [ticket, setTicket] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch ticket details
  const fetchTicket = async () => {
    try {
      const response = await TicketService.getTicketDetails(ticketId);
      setTicket(response.data);
    } catch (err) {
      console.error('Failed to fetch ticket details', err);
    }
  };

  useEffect(() => {
    if (!ticketId) return;
    fetchTicket();
  }, [ticketId]);

  // Pass updated ticket from header hooks
  const handleUpdateTicket = (updatedTicket: any) => {
    setTicket(updatedTicket);
  };

  if (!ticket) return <p className="p-4">Loading ticket...</p>;

  return (
    <div>
      <TicketDetailsHeader
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        ticketId={ticketId}
        ticket={ticket}
        onUpdateTicket={fetchTicket} // Pass the fetch function
      />

      <TicketDetailsSla ticket={ticket} />

      <TicketRightSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ticket={ticket}
      />
    </div>
  );
}
