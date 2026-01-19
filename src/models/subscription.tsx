export interface ClientSubscription {
  id: string;
  userId: string;
  name: string;
  planId: string;
  amount: string;
  address: string;
  status: string;
  nextBillingDate: string;
}

export interface CreateSubscription {
  userId: string;
  planId: string;
  amount: string;
  address: string;
  status: string;
  nextBillingDate: string;
}

export interface UpdateSubscriptionStatus {
  status: string;
}

export interface UpdateSubscriptionBalance {
  balance: string;
}
