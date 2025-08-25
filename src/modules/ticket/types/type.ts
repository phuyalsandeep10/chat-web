type Status = string & {}; // Accept any other string,

export interface Assignee {
  id: number;
  name: string;
  image: string | null;
}

export type TicketCardProps = {
  id: number;
  email: string;
  timeAgo: string;
  title: string;
  priority: string;
  priority_fg_color: string;
  priority_bg_color: string;
  status_fg_color: string;
  status_bg_color: string;
  status: Status;
  avatarUrl?: string;
  created_by?: string;
  checked?: boolean;
  onCheckChange?: (checked: boolean) => void;
  assignees?: Assignee[];
};

import { z } from 'zod';
import { createTicketSchema } from '@/modules/ticket/types/ticket.schema';

// Form data type inferred from Zod schema
export type TicketFormData = z.infer<typeof createTicketSchema>;

// Priority type for usePriorities hook
export interface Priority {
  id: number;
  name: string;
  bg_color: string;
  fg_color: string;
}

// Team type for useTeams hook and useTeamStore
export interface Team {
  id: number;
  name: string;
}

// Team member type for useTeamMembers hook
export interface TeamMember {
  user: {
    id: number;
    name: string;
  };
}

// Customer type for useCustomers hook
export interface Customer {
  id: number;
  email: string;
  name?: string;
  phone?: string;
  location?: string;
}

// Option type for SelectField and MultiSelectField
export interface SelectOption {
  label: string | React.ReactNode;
  value: string;
}

// API payload type for /tickets/ endpoint
export interface TicketPayload {
  title: string;
  description: string;
  sender_domain: string;
  notes?: string;
  attachment: string;
  priority_id: number;
  department_id: number;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_location: string;
  assignees: number[];
}

// API payload type for /customers/ endpoint
export interface CustomerPayload {
  name: string;
  email: string;
  phone: string;
  location: string;
}
