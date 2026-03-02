import type { Plan } from "./Plan";
import type { UserSubscription } from "./subscription";

export interface BillingInfo {
  id: string;
  user: string;
  plan: string;
  subscription: string;
  customer: string;
  amount: string;
  due_date: string;
  created_at: string;
}

export interface CreateBilling {
  user: string;
  plan: string;
  subscription: string;
  customer: string;
  amount: string;
  due_date: string;
}

export interface UserBillingInfo {
  id: string;
  user: string;
  customer: string;
  plan: Plan;
  subscription: UserSubscription;
  amount: string;
  due_date: string;
  created_at: string;
  total_paid: number;
  total_change_given_back: number;
  total_credits: number;
  status: string;
}
