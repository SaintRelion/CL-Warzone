import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "@saintrelion/notifications";
import { AuthProvider } from "@saintrelion/auth-lib";
import { router } from "./navigations";

import "./main.css";

import "@/sr-config";

import "@/repositories/UserRepo";

import "@/repositories/PlanRepo";
import "@/repositories/SubscriptionRepo";
import "@/repositories/BillingRepo";
import "@/repositories/PaymentHistoryRepo";
import "@/repositories/SupportTicketRepo";
import "@/repositories/OTPRepo";
import "@/repositories/ReportRepo";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <NotificationProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </NotificationProvider>,
);
