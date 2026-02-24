import type { ActivityLog } from "@/models/ActivityLog";
import { create } from "zustand";

interface ActivityLogsStore {
  selectedActivityLog: ActivityLog | null;
  viewActivityLog: (activityLog: ActivityLog | null) => void;

  // FILTERS
  currentPage: number;
  setCurrentPage: (page: number) => void;

  searchTerm: string;
  setSearchTerm: (search: string) => void;

  categoryFilter: string;
  setCategoryFilter: (category: string) => void;

  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export const useActivityLogsStore = create<ActivityLogsStore>((set) => ({
  selectedActivityLog: null,
  viewActivityLog: (activityLog) => set({ selectedActivityLog: activityLog }),

  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),

  searchTerm: "",
  setSearchTerm: (search) => set({ searchTerm: search }),

  categoryFilter: "all",
  setCategoryFilter: (category) => set({ categoryFilter: category }),

  statusFilter: "all",
  setStatusFilter: (status) => set({ statusFilter: status }),
}));
