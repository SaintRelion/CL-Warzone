import type { RawAuthUser } from "@saintrelion/auth-lib/dist/models/types";

export interface User extends RawAuthUser {
  first_name: string;
  last_name: string;
  phone_number: string;
  street_address: string;
  city_municipality: string;
  zip_code: string;
  service_area: string;
}
