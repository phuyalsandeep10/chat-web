export type UpdateProfileFormValues = {
  name: string;
  mobile: string;
  image: string | null;
  address?: string;
  country: string;
  language?: string;
  email?: string;
  phone_code_id?: number;
};

export type FetchProfileFormValues = {
  name: string;
  mobile: string;
  image: string | null;
  address?: string;
  country: string;
  language?: string;
  email?: string;
  phone_code?: string;
};
