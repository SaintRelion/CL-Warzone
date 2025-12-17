export interface PaymentMethod {
  id: number;
  type: string;
  number: string;
  expiry: string;
  isDefault: boolean;
}
