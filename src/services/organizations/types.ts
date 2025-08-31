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

export type TimeZone = {
  id: number;
  name: string;
  display_name: string;
  country_id: number;
  country_name: string;
  country_code: string;
};

export type CountriesApiResponse = {
  success: boolean;
  message: string;
  data: {
    countries: Country[];
  };
};

export type TimeZonesApiResponse = {
  success: boolean;
  message: string;
  data: {
    timezones: TimeZone[];
  };
};
