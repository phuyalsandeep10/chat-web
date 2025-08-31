'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { confirmTicket } from '@/services/ticketConfirm/ticketConfirmService';
import { showToast } from '@/shared/toast';

export default function TicketConfirm() {
  const params = useParams();
  const id = params.id as string | undefined;
  const token = params.token as string | undefined;
  const orgId = params.orgId as string;

  const { mutate, status, data, error } = useMutation({
    mutationFn: () => {
      if (!id || !token) throw new Error('Missing ticket ID or token');
      return confirmTicket(orgId, id, token);
    },
    onSuccess: (data) => {
      showToast({
        title: 'Success',
        description: data.message || 'Ticket confirmed successfully!',
        variant: 'success',
      });
    },
    onError: (error: any) => {
      showToast({
        title: 'Error',
        description:
          error?.response?.data?.message || 'Ticket confirmation failed.',
        variant: 'error',
      });
    },
  });

  useEffect(() => {
    if (id && token) {
      mutate(); // ✅ call stable mutate function
    }
    // Only id and token are stable dependencies
  }, [id, token, mutate]);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Ticket Confirmation</h1>

      {status === 'pending' && <p>Confirming your ticket...</p>}
      {status === 'error' && (
        <p>
          {(error as any)?.response?.data?.message ||
            'Error confirming ticket.'}
        </p>
      )}
      {status === 'success' && <p>{data?.message}</p>}
    </div>
  );
}
