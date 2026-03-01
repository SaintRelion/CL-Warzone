import { useResourceLocked } from "@saintrelion/data-access-layer";
import type { UserBillingInfo } from "@/models/Billing";
import type { SupportTicket } from "@/models/SupportTicket";
import TicketSummary from "@/components/admin-dashboard/TicketSummary";
import type { UserSubscription } from "@/models/subscription";
import KPICard from "@/components/admin-dashboard/KPICard";
import MonthlyCards from "@/components/admin-dashboard/MonthlyCards";

export const AdminDashboardPage = () => {
  const { useList: getUserSubscriptions } =
    useResourceLocked<UserSubscription>("subscription");
  const userSubscriptions = getUserSubscriptions({
    filters: { status: "active" },
  }).data;

  const { useList: allTickets } =
    useResourceLocked<SupportTicket>("supportticket");
  const tickets = allTickets().data;

  const { useList: allUserBillings } =
    useResourceLocked<UserBillingInfo>("userbilling");
  const userBillings = allUserBillings().data;

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
        userSubscriptions={userSubscriptions}
        userBillings={userBillings}
        tickets={tickets}
      />

      {/* ===================== ANALYTICS ===================== */}
      <MonthlyCards userBillings={userBillings} tickets={tickets} />

      {/* ===================== OPERATIONS ===================== */}
      <TicketSummary tickets={tickets} />
    </div>
  );
};
