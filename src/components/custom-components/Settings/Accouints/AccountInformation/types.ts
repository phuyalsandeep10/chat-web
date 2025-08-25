export interface ProfileSectionProps {
  name: string;
  email: string;
  country: string;
  address: string;
  mobile: string;
  profileImage: string;
}

export type UpdateProfileFormValues = {
  name: string;
  mobile: string;
  address: string;
  country: string;
  language: string;
  email?: string;
};
