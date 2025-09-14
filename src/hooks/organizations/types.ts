export type Organization = {
  id: number;
  name: string;
  domain?: string | null;
  description?: string | null;
  logo?: string | null;
  purpose?: string | null;
  active?: boolean;
  contact_email?: string | null;
  contact_phone?: string | null;
  twitter_username?: string | null;
  facebook_username?: string | null;
  whatsapp_number?: string | null;
  telegram_username?: string | null;
  owner_id?: number | null;
  identifier?: string | null;
  created_at?: string;
  contact_dial_code?: string | null;
  owner_image?: string | null;
  owner_name?: string | null;
  timezone_id?: number | null;
};

export type Owner = {
  id: number;
  name: string;
  email: string;
  country: string;
  is_superuser: boolean;
  is_staff: boolean;
  is_active: boolean;
  mobile?: string;
  address?: string;
  image?: string;
  language?: string;
  two_fa_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
  email_verified_at?: string;
  [key: string]: any;
};

export type OrganizationAPIResponse = {
  organization: Organization;
  owner_name: Owner;
};

export type OrganizationListResponse = {
  data: Organization[];
  success: boolean;
  message?: string;
};

export interface OrganizationMember {
  id: number;
  active: boolean;
  updated_by_id: number | null;
  user_id: number;
  days: string[];
  start_time: string | null;
  total_hours: number | null;
  created_at: string;
  updated_at: string;
  created_by_id: number | null;
  deleted_at: string | null;
  organization_id: number;
  shift: string | null;
  end_time: string | null;
  client_handle_limit: number | null;
  user: User;
  member_roles: any[];
}

export interface User {
  image: string | null;
  two_fa_enabled: boolean;
  is_staff: boolean;
  mobile: string | null;
  two_fa_secret: string | null;
  attributes: {
    organization_id: number;
  };
  phone_code: string | null;
  two_fa_auth_url: string | null;
  created_at: string;
  address: string | null;
  is_online: boolean;
  updated_at: string;
  country: string | null;
  last_seen: string;
  id: number;
  language: string;
  email_verified_at: string;
  name: string;
  password: string;
  is_superuser: boolean;
  email: string;
  is_active: boolean;
}

export interface OrganizationMemberResponse {
  success: boolean;
  message: string;
  data: OrganizationMember[];
}

export interface OwnershipInvitationPayload {
  organization_id?: number;
  owner_id: number;
}
