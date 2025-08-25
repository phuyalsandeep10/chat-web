export type Organization = {
  id: number;
  name: string;
  domain?: string;
  description?: string;
  logo?: string;
  purpose?: string;
  active?: boolean;
  contact_email?: string | null;
  contact_phone?: string | null;
  twitter_username?: string | null;
  facebook_username?: string | null;
  whatsapp_number?: string | null;
  telegram_username?: string | null;
  owner_id?: number;
};

export type OrganizationResponse = {
  data: Organization;
  message?: string;
  success: boolean;
};
