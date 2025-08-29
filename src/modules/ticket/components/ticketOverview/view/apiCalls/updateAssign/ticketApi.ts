import axiosInstance from '@/apiConfigs/axiosInstance';

export type UpdateTicketPayload = {
  title?: string;
  description?: string;
  sender_domain?: string;
  notes?: string;
  attachments?: string[];
  priority_id?: number;
  status_id?: number;
  department_id?: string;
  sla_id?: string;
  created_by_id?: string;
  updated_by_id?: string;
  customer_id?: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_location?: string;
  assignees?: number[];
  is_spam?: boolean;
};

export const updateTicket = async (
  ticketId: string | number,
  data: UpdateTicketPayload,
) => {
  const response = await axiosInstance.patch(`/tickets/${ticketId}`, data);
  return response.data;
};
