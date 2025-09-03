'use client';
import GeneralInfo from '@/components/custom-components/Inbox/InboxChatInfo/Informations/GeneralInfo';
import { TicketProvider } from '@/context/ticket.context';
import TicketDetails from '@/modules/ticket/pages/TicketDetails';
import { getTicketDetails } from '@/services/ticket/ticketServices';
import React from 'react';
import { useParams } from 'next/navigation';

const Page = () => {
  const params: any = useParams();
  const ticketId = params?.ticketId;

  return (
    <div>
      <TicketProvider ticketId={Number(ticketId)}>
        <TicketDetails />
      </TicketProvider>
    </div>
  );
};

export default Page;
