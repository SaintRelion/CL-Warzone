import { Activity, AlertCircle, DollarSign, Users } from "lucide-react";
import { StatCard } from "../general/StatCard";
import type { UserBillingInfo } from "@/models/Billing";
import type { SupportTicket } from "@/models/SupportTicket";
import type { Subscription } from "@/models/subscription";

const KPICard = ({
  subscriptions,
  billings,
  tickets,
}: {
  subscriptions: Subscription[];
  billings: UserBillingInfo[];
  tickets: SupportTicket[];
}) => {
  const totalUsers = subscriptions.length;
  const totalRevenue =
    billings
      ?.filter((b) => b.status === "paid")
      .reduce((sum, billing) => {
        const amount = parseFloat(
          billing.amount?.toString().replace(/[^\d.]/g, "") || "0",
        );
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0) || 0;

  const totalTickets = tickets.length;
  const openTickets = tickets.filter(
    (t) => t.status !== "resolved" && t.status !== "closed",
  ).length;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={Users}
        title="Active Subscribers"
        value={totalUsers.toLocaleString()}
        color="blue"
      />
      <StatCard
        icon={DollarSign}
        title="Total Revenue"
        value={`₱${Math.round(totalRevenue).toLocaleString()}`}
        color="green"
      />
      <StatCard
        icon={AlertCircle}
        title="Open Tickets"
        value={openTickets.toString()}
        color="yellow"
      />
      <StatCard
        icon={Activity}
        title="Total Tickets"
        value={totalTickets.toString()}
        color="purple"
      />
    </div>
  );
};
export default KPICard;
