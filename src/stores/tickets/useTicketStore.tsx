import type { SupportTicket } from "@/models/SupportTicket";
import { create } from "zustand";

export type TicketPriorityFilter = "all" | "urgent" | "high" | "medium" | "low";
export type TicketFilter =
  | "all"
  | "open"
  | "in_progress"
  | "resolved"
  | "closed";

interface TicketStore {
  selectedTicket: SupportTicket | null;
  viewTicket: (ticket: SupportTicket | null) => void;

  // FILTERS
  searchTerm: string;
  setSearchTerm: (search: string) => void;

  ticketFilter: TicketFilter;
  setTicketFilter: (filter: TicketFilter) => void;

  ticketPriorityFilter: TicketPriorityFilter;
  setTicketPriorityFilter: (filter: TicketPriorityFilter) => void;
}

export const useTicketStore = create<TicketStore>((set) => ({
  selectedTicket: null,
  viewTicket: (ticket) => set({ selectedTicket: ticket }),

  // FILTERS
  searchTerm: "",
  setSearchTerm: (search) =>
    set({
      searchTerm: search,
    }),

  ticketFilter: "all",
  setTicketFilter: (filter) =>
    set({
      ticketFilter: filter,
    }),

  ticketPriorityFilter: "all",
  setTicketPriorityFilter: (filter) =>
    set({
      ticketPriorityFilter: filter,
    }),
}));
