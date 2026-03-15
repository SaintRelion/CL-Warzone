import { Activity, AlertCircle, DollarSign, Users } from "lucide-react";
import { StatCard } from "../general/StatCard";
import type { UserBillingInfo } from "@/models/Billing";

const KPICard = ({
  totalUsers,
  userBillings,
  totalTickets,
  openTickets,
}: {
  totalUsers: number;
  userBillings: UserBillingInfo[];
  totalTickets: number;
  openTickets: number;
}) => {
  const totalRevenue =
    userBillings
      ?.filter((b) => b.status === "paid")
      .reduce((sum, billing) => {
        const amount = parseFloat(
          billing.amount?.toString().replace(/[^\d.]/g, "") || "0",
        );
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0) || 0;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={Users}
        title="Users"
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
