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
  user_name: string;
  image: string;
  email: string;
  user_id: number;
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
