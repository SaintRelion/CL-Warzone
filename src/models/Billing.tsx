export interface BillingInfo {
  id: string;
  userId: string;
  planId: string;
  customer: string;
  amount: string;
  method: string;
  status: string;
  nextBillingDate: string;
  createdAt: string;
}

export interface CreateBilling {
  userId: string;
  planId: string;
  customer: string;
  amount: string;
  method: string;
  status: string;
  nextBillingDate: string;
}

export interface UpdateBilling {
  status: string;
}
