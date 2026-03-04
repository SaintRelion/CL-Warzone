import type { UserBillingInfo } from "@/models/Billing";
import type { PaymentHistory } from "@/models/PaymentHistory";
import { create } from "zustand";

export type BillingFilter = "paid" | "unpaid" | "this-month" | "all";
export type BillingSort = "date" | "amount" | "customer";
export type BillingSortOrder = "desc" | "asc";

interface BillingStore {
  selectedBillingInfo: UserBillingInfo | null;
  selectedPaymentHistory: PaymentHistory | null;
  billBehavior: "" | "payment" | "paymenthistory" | "updatepayment";

  processPayment: (bill: UserBillingInfo) => void;
  viewPaymentHistory: (bill: UserBillingInfo) => void;
  printReceipt: (bill: UserBillingInfo, paymentHistory: PaymentHistory) => void;
  clearAll: () => void;

  // FILTERS
  currentPage: number;
  setCurrentPage: (page: number) => void;

  searchTerm: string;
  setSearchTerm: (search: string) => void;

  billingFilter: BillingFilter;
  setBillingFilter: (filter: BillingFilter) => void;

  billingSort: BillingSort;
  setBillingSort: (sort: BillingSort) => void;

  billingSortOrder: BillingSortOrder;
  setBillingSortOrder: (sortOrder: BillingSortOrder) => void;
}

export const useBillingStore = create<BillingStore>((set) => ({
  selectedBillingInfo: null,
  selectedPaymentHistory: null,
  billBehavior: "",

  processPayment: (bill) =>
    set({ billBehavior: "payment", selectedBillingInfo: bill }),
  viewPaymentHistory: (bill) =>
    set({ billBehavior: "paymenthistory", selectedBillingInfo: bill }),
  printReceipt: (bill, paymentHistory) =>
    set({ selectedBillingInfo: bill, selectedPaymentHistory: paymentHistory }),

  clearAll: () =>
    set({
      billBehavior: "",
      selectedBillingInfo: null,
      selectedPaymentHistory: null,
    }),

  // FILTERS
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),

  searchTerm: "",
  setSearchTerm: (search) => set({ searchTerm: search }),

  billingFilter: "all",
  setBillingFilter: (filter) => set({ billingFilter: filter }),

  billingSort: "date",
  setBillingSort: (sort) => set({ billingSort: sort }),

  billingSortOrder: "desc",
  setBillingSortOrder: (sortOrder) => set({ billingSortOrder: sortOrder }),
}));
