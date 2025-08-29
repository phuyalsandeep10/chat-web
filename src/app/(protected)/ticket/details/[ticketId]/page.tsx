'use client';
import GeneralInfo from '@/components/custom-components/Inbox/InboxChatInfo/Informations/GeneralInfo';
import TicketDetails from '@/modules/ticket/pages/TicketDetails';
import { getTicketDetails } from '@/services/ticket/services';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const page = () => {
  return (
    <div>
      <TicketDetails />
    </div>
  );
};

export default page;
