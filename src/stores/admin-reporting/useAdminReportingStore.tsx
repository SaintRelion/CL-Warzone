import type { MonthlyPaymentReport } from "@/models/Report";
import { create } from "zustand";

export type FilterStatus = "all" | "Paid" | "Unpaid";

interface AdminReportingStore {
  report: MonthlyPaymentReport | null;
  viewReport: (report: MonthlyPaymentReport | null) => void;

  isGeneratingReport: boolean;
  setGeneratingReport: (state: boolean) => void;

  dateToReport: number[];
  setDateToReport: (month: number, year: number) => void;
  clearDateToReport: () => void;

  statusFilter: FilterStatus;
  setStatusFilter: (filter: FilterStatus) => void;
}

export const useAdminReportingStore = create<AdminReportingStore>((set) => ({
  report: null,
  viewReport: (report) => set({ report: report }),

  isGeneratingReport: false,
  setGeneratingReport: (state) => set({ isGeneratingReport: state }),

  dateToReport: [],
  setDateToReport: (month, year) => set({ dateToReport: [month, year] }),
  clearDateToReport: () => set({ dateToReport: [] }),

  statusFilter: "all",
  setStatusFilter: (filter) => set({ statusFilter: filter }),
}));
