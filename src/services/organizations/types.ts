export interface createOrganizationPayload {
  name: string;
  description?: string;
  logo?: string;
  purpose: string;
  domain: string;
}

export type Country = {
  id: number;
  name: string;
  code: string;
  phone_code: string;
};

export type Langauge = {
  id: number;
  name: string;
};

export type CountriesApiResponse = {
  success: boolean;
  message: string;
  data: {
    countries: Country[];
  };
};
