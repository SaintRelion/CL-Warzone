import { create } from "zustand";

export type LiveNotification = {
  resource: string; // e.g., "subscription", "billing", "payment"
  message: string;
  payload?: Record<string, string>; // additional info if needed
};

type NotificationState = {
  latest: LiveNotification | null;
  setNotification: (notification: LiveNotification) => void;
  clearNotification: () => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  latest: null,
  setNotification: (notification) => set({ latest: notification }),
  clearNotification: () => set({ latest: null }),
}));
