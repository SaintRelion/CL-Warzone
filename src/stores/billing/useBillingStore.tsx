import type { UserBillingInfo } from "@/models/Billing";
import type { PaymentHistory } from "@/models/PaymentHistory";
import { create } from "zustand";

export type BillingFilter = "paid" | "unpaid" | "this-month" | "all";
export type BillingSort = "date" | "amount" | "customer";
export type BillingSortOrder = "desc" | "asc";

interface BillingStore {
  selectedBillingInfo: UserBillingInfo | null;
  selectedPaymentHistory: PaymentHistory | null;
  cashierBehavior: "" | "payment" | "paymenthistory" | "updatepayment";

  printReceipt: (bill: UserBillingInfo, paymentHistory: PaymentHistory) => void;
  processPayment: (bill: UserBillingInfo) => void;
  viewPaymentHistory: (bill: UserBillingInfo) => void;
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
  cashierBehavior: "",

  printReceipt: (bill, paymentHistory) =>
    set({ selectedBillingInfo: bill, selectedPaymentHistory: paymentHistory }),
  processPayment: (bill) =>
    set({ cashierBehavior: "payment", selectedBillingInfo: bill }),
  viewPaymentHistory: (bill) =>
    set({ cashierBehavior: "paymenthistory", selectedBillingInfo: bill }),

  clearAll: () =>
    set({
      cashierBehavior: "",
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
