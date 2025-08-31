'use client';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface TicketSLABreachDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: {
    message: string;
    level: number;
    alert_type?: 'response' | 'resolution';
    payload?: {
      id: number;
      title: string;
      description: string;
    };
  } | null;
}

const TicketSLABreachDialog = ({
  open,
  setOpen,
  data,
}: TicketSLABreachDialogProps) => {
  const router = useRouter();

  if (!data) return null;
  const { message, level, alert_type, payload } = data;
  const isCritical = level >= 100;
  const isWarning = level >= 70 && level < 100;

  const alertLabel =
    alert_type === 'response'
      ? 'SLA Breach Response'
      : alert_type === 'resolution'
        ? 'SLA Breach Resolution'
        : 'SLA Breach';

  const handleResolve = () => {
    setOpen(false);
    router.push(`/ticket/details/${payload?.id}`);
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent
        className="w-full p-3.5 sm:max-w-[364px]"
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div
            className={`flex h-13 w-13 items-center justify-center rounded-full ${
              isCritical ? 'bg-[#FAD6D5]' : 'bg-yellow-100'
            }`}
          >
            <TriangleAlert
              className={`h-6 w-6 ${
                isCritical ? 'text-[#F61818]' : 'text-[#F5CE31]'
              }`}
            />
          </div>
        </div>

        {/* Title */}
        <AlertDialogHeader>
          <AlertDialogTitle className="font-outfit text-center text-base font-medium">
            {alertLabel} {isCritical ? 'Time Detected' : 'Time Warning'}
          </AlertDialogTitle>
        </AlertDialogHeader>

        {payload?.id && (
          <p className="font-outfit ml-3 text-left text-sm font-semibold text-black">
            Ticket-ID:<span className="font-medium">{payload.id}</span>
          </p>
        )}
        {payload?.title && (
          <p className="font-outfit ml-3 text-left text-sm font-semibold text-black">
            Title: <span className="font-medium">{payload.title}</span>
          </p>
        )}

        {/* Description */}
        <p
          className={`font-outfit px-2 text-center text-xs ${
            isCritical ? 'text-[#F61818]' : 'text-black'
          }`}
        >
          {!isCritical
            ? 'This ticket is approaching its SLA deadline. Please take action to ensure compliance.'
            : 'This ticket is now out of compliance. Immediate attention is required to avoid escalation.'}
          {/* {message} */}
        </p>

        {/* Buttons */}
        <div className="mt-4 flex items-center justify-center gap-3 text-xs font-semibold">
          <button
            onClick={() => setOpen(false)}
            className={`w-32.5 rounded-xl border py-3 ${
              isCritical
                ? 'border-[#737373] text-[#737373]'
                : 'border-brand-primary text-brand-primary'
            } font-normal transition hover:bg-gray-50`}
          >
            {isCritical ? 'Remind me later' : 'Cancel'}
          </button>
          <button
            onClick={handleResolve}
            className={`w-32.5 rounded-xl py-3 font-semibold transition ${
              isCritical
                ? 'bg-alert-prominent text-white hover:bg-red-700'
                : 'bg-warning-prominent text-white hover:bg-yellow-500'
            }`}
          >
            {isCritical ? 'Resolve Now' : 'Resolve'}
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TicketSLABreachDialog;
