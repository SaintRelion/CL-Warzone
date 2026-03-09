import type { AuditLog } from "@/models/AuditLog";
import { create } from "zustand";

interface AuditLogsStore {
  selectedAuditLog: AuditLog | null;
  viewAuditLog: (activityLog: AuditLog | null) => void;

  // FILTERS
  currentPage: number;
  setCurrentPage: (page: number) => void;

  searchTerm: string;
  setSearchTerm: (search: string) => void;

  actionFilter: string;
  setActionFilter: (category: string) => void;
}

export const useAuditLogsStore = create<AuditLogsStore>((set) => ({
  selectedAuditLog: null,
  viewAuditLog: (activityLog) => set({ selectedAuditLog: activityLog }),

  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),

  searchTerm: "",
  setSearchTerm: (search) => set({ searchTerm: search }),

  actionFilter: "all",
  setActionFilter: (category) => set({ actionFilter: category }),
}));
