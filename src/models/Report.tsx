export interface MonthlyPaymentReportItem {
  userId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  billingAmount: string;
  paidAmount: string;
  status: "Paid" | "Partially Paid" | "Not Yet Paid";
  planId: string;
  paymentDate?: string;
  paymentMethod?: string;
  transactionRef?: string;
}

export interface MonthlyPaymentReport {
  month: number;
  year: number;
  generatedAt: string;
  totalBillable: number;
  totalCollected: number;
  totalPending: number;
  items: MonthlyPaymentReportItem[];
  summary: {
    totalSubscribers: number;
    paidSubscribers: number;
    partiallyPaidSubscribers: number;
    unpaidSubscribers: number;
    collectionRate: number; // percentage
  };
}

export interface ReportFilter {
  month: number;
  year: number;
  status?: "all" | "Paid" | "Not Yet Paid" | "Partially Paid";
  sortBy?: "name" | "amount" | "status";
  sortOrder?: "asc" | "desc";
}
