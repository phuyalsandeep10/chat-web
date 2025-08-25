'use client';

import React from 'react';
import { Icons } from '@/components/ui/Icons';
import Priority from './Priority/Priority';
import SLA from './sla/Sla';
import { useSlaLogic } from './sla/hooks/useSlaLogic';
import TicketStatus from './ticketStatus/TicketStatus';

const TicketSystem = () => {
  const { slaList, isLoading } = useSlaLogic();

  return (
    <>
      <div>
        <h1 className="text-brand-dark flex items-center text-[32px] font-semibold">
          Ticket System Settings
          <Icons.help />
        </h1>
        <p className="font-outfit mt-1 text-xs font-normal text-black">
          Configure and customize your ticket management system.
        </p>
      </div>

      <div className="mt-11">
        <div className="mt-5">{!isLoading && <SLA slaList={slaList} />}</div>
      </div>

      <div className="mt-10">
        <Priority />
      </div>
      <div className="mt-10">
        <TicketStatus />
      </div>
    </>
  );
};

export default TicketSystem;
