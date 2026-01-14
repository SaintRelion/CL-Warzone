export interface PaymentHistory {
  id: string;
  billId: string;
  userId: string;
  customer: string;
  method: string;
  amount: string;
  change: string;
  status: string;
  transactionScreenshot: string;
  transactionRef: string;
  nextBillingDate: string; // The Due date at that time of payment, just to keep track
  createdAt: string;
}

export interface CreatePaymentHistory {
  billId: string;
  userId: string;
  method: string;
  amount: string;
  change: string;
  status: string;
  transactionScreenshot: string;
  transactionRef: string;
  nextBillingDate: string;
}
