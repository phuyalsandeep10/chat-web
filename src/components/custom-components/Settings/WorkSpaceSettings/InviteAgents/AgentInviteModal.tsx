// components/ui/ReusableDialog.tsx
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import AddAgent from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AddAgent';

type AgentInviteModalProps = {
  open?: boolean; // allow controlled use
  onOpenChange?: (open: boolean) => void;
  trigger: React.ReactNode;
  children?: React.ReactNode;
  dialogClass?: string;
  dialogTitle?: string;
  dialogDescription?: string;
};

const AgentInviteModal: React.FC<AgentInviteModalProps> = ({
  trigger,
  children = null,
  dialogClass = '',
  dialogTitle = '',
  dialogDescription = '',
  open,
  onOpenChange,
}) => {
  const handleOpenChange = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {/* <DialogTrigger asChild>{trigger}</DialogTrigger> */}
      <DialogContent className={`!w-full !max-w-[1240px] gap-8 ${dialogClass}`}>
        <DialogHeader className="gap-0">
          <DialogTitle className="text-xl leading-[30px] font-semibold">
            {dialogTitle}
          </DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default AgentInviteModal;
