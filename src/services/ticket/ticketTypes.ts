export interface TicketType {
  id: number;
  title: string;
  customer_email: string;
  created_by_id: number;
  priority_id: number;
  status_id: number;
  created_at: string;
}

export interface Ticket {
  id?: number;
  sender: string;
  receiver?: string;
  content: string;
  direction: 'incoming' | 'outgoing';
  created_at: string;
  isEdited?: boolean;
}
export interface TicketResponse {
  success: boolean;
  message: string;
  data: TicketType[];
}
export interface SendMessagePayload {
  ticket_id: number | string;
  receiver: string;
  content: string;
}
export interface UpdateMessage {
  content: string;
  message_id: number;
}
