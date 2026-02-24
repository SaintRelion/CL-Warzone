import type { UserSubscription } from "@/models/subscription";
import { create } from "zustand";

interface SubscribersStore {
  selectedUserSubscription: UserSubscription | null;
  isViewOpen: boolean;
  isEditOpen: boolean;

  openView: (sub: UserSubscription) => void;
  openEdit: (sub: UserSubscription) => void;
  closeAll: () => void;

  // FILTER
  searchTerm: string;
  setSearchTerm: (search: string) => void;

  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const useSubscribersStore = create<SubscribersStore>((set) => ({
  selectedUserSubscription: null,
  isViewOpen: false,
  isEditOpen: false,
  isMoreMenuOpen: false,

  openView: (sub) =>
    set({
      selectedUserSubscription: sub,
      isViewOpen: true,
      isEditOpen: false,
    }),

  openEdit: (sub) =>
    set({
      selectedUserSubscription: sub,
      isEditOpen: true,
      isViewOpen: false,
    }),

  closeAll: () =>
    set({
      selectedUserSubscription: null,
      isViewOpen: false,
      isEditOpen: false,
    }),

  // FILTER
  searchTerm: "",
  setSearchTerm: (search) => set({ searchTerm: search }),

  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
}));
