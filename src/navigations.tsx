import NotFound from "./pages/NotFound";

import LoginPage from "./pages/authentication/LoginPage";
import { AdminDashboardPage } from "./pages/admin/admin-dashboard/AdminDashboardPage";
import SubscribersPage from "./pages/admin/subscribers/SubscribersPage";
import BillingPage from "./pages/admin/billing/BillingPage";
import BrowsePlansPage from "./pages/client/plans/BrowsePlansPage";
import BillingAndPaymentsPage from "./pages/client/billing-and-payments/BillingAndPaymentsPage";
import SupportTicketsPage from "./pages/client/support-tickets/SupportTicketsPage";
import AccountPage from "./pages/client/account/AccountPage";
import FAQPage from "./pages/client/faq/FAQPage";
import RegisterPage from "./pages/authentication/RegisterPage";
import TicketsPage from "./pages/admin/tickets/TicketsPage";
import { AdminLayout } from "./layout/AdminLayout";
import { ClientLayout } from "./layout/ClientLayout";
import { PublicLayout } from "./layout/PublicLayout";

import {
  registerGroupAppRoutes,
  createAppRouter,
  createRoleLayout,
} from "@saintrelion/routers";
import { roleLayoutMap } from "@saintrelion/auth-lib";
import ActivityLogsPage from "./pages/admin/activity-logs/ActivityLogsPage";

roleLayoutMap[""] = {
  redirect: "/",
  layout: PublicLayout,
};
roleLayoutMap["admin"] = {
  redirect: "/admin",
  layout: AdminLayout,
};
roleLayoutMap["client"] = {
  redirect: "/",
  layout: ClientLayout,
};

registerGroupAppRoutes({
  path: "/",
  layout: createRoleLayout(""),
  errorElement: <NotFound />,
  children: [
    { path: "login", public: true, element: <LoginPage /> },
    { path: "register", public: true, element: <RegisterPage /> },
  ],
});

registerGroupAppRoutes({
  path: "/admin",
  layout: createRoleLayout("admin"),
  errorElement: <NotFound />,
  children: [
    {
      index: true,
      element: <AdminDashboardPage />,
      label: "Dashboard",
      iconClassName: "fa-solid fa-house text-lg",
      allowedRoles: ["admin"],
    },
    {
      path: "subscribers",
      element: <SubscribersPage />,
      label: "Subscribers",
      iconClassName: "fa-solid fa-users text-lg",
      allowedRoles: ["admin"],
    },
    {
      path: "billing",
      element: <BillingPage />,
      label: "Bill",
      iconClassName: "fa-solid fa-receipt text-lg",
      allowedRoles: ["admin"],
    },
    {
      path: "tickets",
      element: <TicketsPage />,
      label: "Support Tickets",
      iconClassName: "fa-solid fa-ticket text-lg",
      allowedRoles: ["admin"],
    },
    {
      path: "activity-logs",
      element: <ActivityLogsPage />,
      label: "Activity Logs",
      iconClassName: "fa-solid fa-clock-rotate-left text-lg",
      allowedRoles: ["admin"],
    },
  ],
});

registerGroupAppRoutes({
  path: "/",
  layout: createRoleLayout("client"),
  errorElement: <NotFound />,
  children: [
    {
      index: true,
      element: <BrowsePlansPage />,
      label: "Browse Plans",
      allowedRoles: ["client"],
    },
    {
      path: "billing",
      element: <BillingAndPaymentsPage />,
      label: "Bill",
      allowedRoles: ["client"],
    },
    {
      path: "support",
      element: <SupportTicketsPage />,
      label: "Support Tickets",
      allowedRoles: ["client"],
    },
    {
      path: "account",
      element: <AccountPage />,
      label: "Account Info",
      allowedRoles: ["client"],
    },
    {
      path: "faq",
      element: <FAQPage />,
      label: "Support & FAQ",
      allowedRoles: ["client"],
    },
  ],
});

// ✅ Create router
export const router = createAppRouter();
