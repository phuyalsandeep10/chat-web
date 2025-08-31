import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTicket, UpdateTicketPayload } from './ticketApi';

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      data,
    }: {
      ticketId: string | number;
      data: UpdateTicketPayload;
    }) => updateTicket(ticketId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};
