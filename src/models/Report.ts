export interface MonthlyPaymentReportItem {
  user: string;
  full_name: string;
  email: string;
  phone_number: string;
  billing_amount: string;
  total_paid: string;
  total_change_given_back: number;
  total_credits: number;
  status: string;
  plan: string;
}

export interface MonthlyPaymentReport {
  month: number;
  year: number;
  generated_at: string;
  total_billable: number;
  total_revenue: number;
  total_unpaid: number;
  items: MonthlyPaymentReportItem[];
  summary: {
    total_subscribers: number;
    paid_subscribers: number;
    unpaid_subscribers: number;
    collection_rate: number;
    total_collected: number;
    total_change_given_back: number;
    total_credits: number;
    net_revenue: number;
  };
}

export interface ReportFilter {
  month: number;
  year: number;
  status?: "all" | "Paid" | "Unpaid";
  sortBy?: "name" | "amount" | "status";
  sortOrder?: "asc" | "desc";
}
