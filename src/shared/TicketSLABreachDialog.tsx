import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import React from 'react';

interface TicketSLABreachDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TicketSLABreachDialog = ({
  open,
  setOpen,
}: TicketSLABreachDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={() => {}}>
      <AlertDialogContent
        className="w-full p-6 sm:max-w-[600px]"
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="font-outfit text-center">
            SLA Breach
          </AlertDialogTitle>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TicketSLABreachDialog;
