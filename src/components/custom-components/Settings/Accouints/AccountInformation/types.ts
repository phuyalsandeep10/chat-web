export interface ProfileSectionProps {
  name: string;
  email: string;
  country: string;
  address: string;
  phone: string;
  profileImage: string;
}

export type UpdateProfileFormValues = {
  name: string;
  image?: string;
  mobile: string;
  address: string;
  country: string;
  language: string;
  email?: string;
};
