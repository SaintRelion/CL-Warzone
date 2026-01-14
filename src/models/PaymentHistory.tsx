export interface PaymentHistory {
  id: string;
  userId: string;
  description: string;
  method: string;
  amount: string;
  status: string;
  invoice: string;
  createdAt: string;
}

export interface CreatePaymentHistory {
  userId: string;
  description: string;
  amount: string;
  status: string;
  invoice: string;
}
