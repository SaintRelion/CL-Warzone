import type { RawAuthUser } from "@saintrelion/auth-lib/dist/models/types";

export interface User extends RawAuthUser {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  serviceArea: string;
}
