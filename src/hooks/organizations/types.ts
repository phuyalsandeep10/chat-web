export type Organization = {
  id: number;
  name: string;
  domain?: string;
  description?: string;
  logo?: string;
  purpose?: string;
  active?: boolean;
  contact_email?: string | null;
  contact_phone?: string | '';
  twitter_username?: string | null;
  facebook_username?: string | null;
  whatsapp_number?: string | null;
  telegram_username?: string | null;
  owner_id?: number;
  identifier?: string;
  created_at?: string;
  contact_dial_code?: string;
  workspace_owner_image?: string;
  workspace_owner_name?: string;
  timezone_id?: number;
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
  name: string;
  image: string;
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
