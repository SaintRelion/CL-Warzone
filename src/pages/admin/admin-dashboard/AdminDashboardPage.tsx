import {
  useResourceLocked,
  type Paginated,
} from "@saintrelion/data-access-layer";
import type { UserBillingInfo } from "@/models/Billing";
import type { SupportTicket } from "@/models/SupportTicket";
import TicketSummary from "@/components/admin-dashboard/TicketSummary";
import KPICard from "@/components/admin-dashboard/KPICard";
import MonthlyCards from "@/components/admin-dashboard/MonthlyCards";
import type { User } from "@/models/user";

export const AdminDashboardPage = () => {
  const { useList: getUsers } = useResourceLocked<Paginated<User>>("user");
  const users = getUsers({
    filters: {
      status__ne: "archived",
      groups__name__ne: "admin",
      is_staff__ne: "True",
      is_superuser__ne: "True",
    },
  }).data;

  const { useList: tickets } =
    useResourceLocked<Paginated<SupportTicket>>("supportticket");
  const allTickets = tickets().data;
  const openTickets = tickets({
    filters: { status__in: ["open", "pending"] },
  }).data;

  const { useList: allUserBillings } =
    useResourceLocked<Paginated<UserBillingInfo>>("userbilling");
  const userBillings = allUserBillings({ filters: { status: "paid" } }).data;

  return (
    <div className="space-y-10">
      <KPICard
        totalUsers={users?.count ?? 0}
        userBillings={userBillings?.results ?? []}
        totalTickets={allTickets?.count ?? 0}
        openTickets={openTickets?.count ?? 0}
      />

      {/* ===================== ANALYTICS ===================== */}
      <MonthlyCards
        userBillings={userBillings?.results ?? []}
        tickets={allTickets?.results ?? []}
      />

      {/* ===================== OPERATIONS ===================== */}
      <TicketSummary tickets={allTickets?.results ?? []} />
    </div>
  );
};
