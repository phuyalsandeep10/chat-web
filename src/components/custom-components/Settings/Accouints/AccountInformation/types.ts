export interface ProfileSectionProps {
  name: string;
  email: string;
  location: string;
  phone: string;
  profileImage: string;
}

export type FormValues = {
  fullName: string;
  email: string;
  address: string;
  country: string;
  language: string;
};

export type UpdateProfileFormValues = {
  name: string;
  mobile: string;
  image: string | null;
  address: string;
  country: string;
  language?: string;
  email?: string;
};
