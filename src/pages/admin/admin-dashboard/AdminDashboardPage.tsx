import { useResourceLocked } from "@saintrelion/data-access-layer";
import type { UserBillingInfo } from "@/models/Billing";
import type { SupportTicket } from "@/models/SupportTicket";
import TicketSummary from "@/components/admin-dashboard/TicketSummary";
import KPICard from "@/components/admin-dashboard/KPICard";
import MonthlyCards from "@/components/admin-dashboard/MonthlyCards";
import type { User } from "@/models/user";

export const AdminDashboardPage = () => {
  const { useList: getUsers } = useResourceLocked<User>("user");
  const users = getUsers().data;

  const { useList: allTickets } =
    useResourceLocked<SupportTicket>("supportticket");
  const tickets = allTickets().data;

  const { useList: allUserBillings } =
    useResourceLocked<UserBillingInfo>("userbilling");
  const userBillings = allUserBillings().data;

  return (
    <div className="space-y-10">

      {/* ===================== KPI ROW ===================== */}
      <KPICard users={users} userBillings={userBillings} tickets={tickets} />

      {/* ===================== ANALYTICS ===================== */}
      <MonthlyCards userBillings={userBillings} tickets={tickets} />

      {/* ===================== OPERATIONS ===================== */}
      <TicketSummary tickets={tickets} />
    </div>
  );
};
