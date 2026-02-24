export interface PaymentHistory {
  id: string;
  bill: string;
  user: string;
  customer: string;
  method: string;
  amount: string;
  change: string;
  credit: string;
  transaction_screenshot: string;
  transaction_ref: string;
  next_billing_date: string; // The Due date at that time of payment, just to keep track
  created_at: string;
  status: string;
  voided_at: string;
  voided_reason: string;
}

export interface CreatePaymentHistory {
  bill: string;
  user: string;
  customer: string;
  method: string;
  amount: string;
  change: string;
  credit: string;
  transaction_screenshot: string;
  transaction_ref: string;
  next_billing_date: string;
  status: string;
}

export interface VoidPaymentHistory {
  status: string;
  voided_at: string;
  voided_reason: string;
}
