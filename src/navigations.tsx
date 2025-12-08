import RootLayout from "./layout/RootLayout";
import NotFound from "./pages/NotFound";

import { registerGroupAppRoutes, createAppRouter } from "@saintrelion/routers";
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
import EquipmentsPage from "./pages/admin/equipments/EquipmentsPage";
import OutagesPage from "./pages/admin/outages/OutagesPage";
import { ProtectedRoute } from "@saintrelion/auth-lib";

// ✅ Register protected routes (with layout)
registerGroupAppRoutes({
  layout: (
    <ProtectedRoute>
      <RootLayout />
    </ProtectedRoute>
  ),
  path: "/",
  errorElement: <NotFound />,
  children: [
    // PUBLIC
    { path: "/login", public: true, element: <LoginPage /> },
    { path: "/register", public: true, element: <RegisterPage /> },
    // RESTRICTED
    // ADMIN
    {
      index: true,
      path: "/admin/",
      element: <AdminDashboardPage />,
      label: "Dashboard",
      iconClassName: "fa-solid fa-house text-lg",
      allowedRoles: ["admin"],
    },
    {
      path: "/admin/subscribers",
      element: <SubscribersPage />,
      label: "Subscribers",
      iconClassName: "fa-solid fa-users text-lg",
      allowedRoles: ["admin"],
    },
    {
      path: "/admin/billing",
      element: <BillingPage />,
      label: "Billing & Payments",
      iconClassName: "fa-solid fa-receipt text-lg",
      allowedRoles: ["admin"],
    },
    {
      path: "/admin/tickets",
      element: <TicketsPage />,
      label: "Support Tickets",
      iconClassName: "fa-solid fa-ticket text-lg",
      allowedRoles: ["admin"],
    },
    // {
    //   path: "/admin/equipment",
    //   element: <EquipmentsPage />,
    //   label: "Equipment",
    //   iconClassName: "fa-solid fa-hard-drive text-lg",
    //   allowedRoles: ["admin"],
    // },
    {
      path: "/admin/outages",
      element: <OutagesPage />,
      label: "Outages",
      iconClassName: "fa-solid fa-triangle-exclamation text-lg",
      allowedRoles: ["admin"],
    },

    // CLIENT
    {
      index: true,
      path: "/",
      element: <BrowsePlansPage />,
      label: "Browse Plans",
      allowedRoles: ["client"],
    },
    {
      path: "/billing",
      element: <BillingAndPaymentsPage />,
      label: "Billing & Payments",
      allowedRoles: ["client"],
    },
    {
      path: "/support",
      element: <SupportTicketsPage />,
      label: "Support Tickets",
      allowedRoles: ["client"],
    },
    {
      path: "/account",
      element: <AccountPage />,
      label: "Account Info",
      allowedRoles: ["client"],
    },
    {
      path: "/faq",
      element: <FAQPage />,
      label: "Support & FAQ",
      allowedRoles: ["client"],
    },
  ],
});

// ✅ Create router
export const router = createAppRouter();
