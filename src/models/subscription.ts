import type { Plan } from "./Plan";

export interface Subscription {
  id: string;
  user: string;
  plan: string;
  amount: string;
  address: string;
  status: string;
  next_billing_date: string;
}

export interface CreateSubscription {
  user: string;
  plan: string;
  amount: string;
  address: string;
  status: string;
  next_billing_date: string;
}

export interface UpdateSubscriptionStatus {
  status: string;
}

export interface UpdateSubscriptionBalance {
  balance: string;
}

// Derived
export interface UserSubscription {
  id: string;
  user: string;
  name: string;
  plan: Plan;
  amount: string;
  address: string;
  status: string;
  next_billing_date: string;
}
