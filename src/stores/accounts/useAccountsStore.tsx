import type { User } from "@/models/user";
import { create } from "zustand";

interface AccountsStore {
  selectedUser: User | null;

  closeAll: () => void;

  // FILTER
  searchTerm: string;
  setSearchTerm: (search: string) => void;

  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const useAccountsStore = create<AccountsStore>((set) => ({
  selectedUser: null,

  closeAll: () =>
    set({
      selectedUser: null,
    }),

  // FILTER
  searchTerm: "",
  setSearchTerm: (search) => set({ searchTerm: search }),

  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
}));
