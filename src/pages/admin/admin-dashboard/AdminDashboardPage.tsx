import { useResourceLocked } from "@saintrelion/data-access-layer";
import type { UserBillingInfo } from "@/models/Billing";
import type { SupportTicket } from "@/models/SupportTicket";
import TicketSummary from "@/components/admin-dashboard/TicketSummary";
import type { Subscription } from "@/models/subscription";
import KPICard from "@/components/admin-dashboard/KPICard";
import MonthlyCards from "@/components/admin-dashboard/MonthlyCards";

export const AdminDashboardPage = () => {
  const { useList: getSubscriptions } =
    useResourceLocked<Subscription>("subscription");
  const subscriptions = getSubscriptions({
    filters: { status: "active" },
  }).data;

  const { useList: allTickets } =
    useResourceLocked<SupportTicket>("supportticket");
  const tickets = allTickets().data;

  const { useList: allBillings } =
    useResourceLocked<UserBillingInfo>("userbilling");
  const billings = allBillings().data;

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Operations Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Enterprise overview of subscribers, revenue, and tickets
        </p>
      </div>

      {/* ===================== KPI ROW ===================== */}
      <KPICard
        subscriptions={subscriptions}
        billings={billings}
        tickets={tickets}
      />

      {/* ===================== ANALYTICS ===================== */}
      <MonthlyCards billings={billings} tickets={tickets} />

      {/* ===================== OPERATIONS ===================== */}
      <TicketSummary tickets={tickets} />
    </div>
  );
};
