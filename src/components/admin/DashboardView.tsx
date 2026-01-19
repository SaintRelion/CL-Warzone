import { StatCard } from "./StatCard";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  AlertCircle,
  DollarSign,
  Activity,
  Users,
} from "lucide-react";
import type { BillingInfo } from "../../models/Billing";
import type { ClientTicket } from "../../models/Tickets";
import { useResourceLocked } from "@saintrelion/data-access-layer";

export const DashboardView = () => {
  const [monthlyIncomeData, setMonthlyIncomeData] = useState<
    { month: string; income: number }[]
  >([]);

  // Fetch actual data using useResourceLocked
  const { useList: getSubscriptions } = useResourceLocked("subscription");
  const subscriptions = getSubscriptions({ filters: { status: "Active" } }).data;

  const { useList: getTickets } = useResourceLocked<ClientTicket>("tickets");
  const tickets = getTickets({}).data;

  const { useList: getBillings } = useResourceLocked<BillingInfo>("userbillings");
  const billings = getBillings({}).data;

  const activeSubscribers = subscriptions?.length || 0;
  const totalTickets = tickets?.length || 0;
  const openTickets = tickets?.filter(
    (t) => t.status !== "Resolved" && t.status !== "Closed"
  ).length || 0;

  // Calculate total revenue from paid billings only
  const totalRevenue = billings?.filter(b => b.status === "Paid").reduce((sum, billing) => {
    const amount = parseFloat(
      billing.amount?.toString().replace(/[^\d.]/g, "") || "0"
    );
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0) || 0;

  // Calculate current month income
  const currentMonthIncome = monthlyIncomeData.length > 0
    ? monthlyIncomeData[monthlyIncomeData.length - 1]?.income || 0
    : 0;

  useEffect(() => {
    if (billings && billings.length > 0) {
      const monthlyData: { [key: string]: number } = {};

      // Only include Paid billings in the monthly income chart
      const paidBillings = billings.filter(b => b.status === "Paid");
      
      paidBillings.forEach((billing: BillingInfo) => {
        // Use createdAt or nextBillingDate as fallback
        const dateStr = billing.createdAt || billing.nextBillingDate;
        const billingDate = dateStr ? new Date(dateStr) : new Date();
        const monthKey = billingDate.toLocaleString("default", {
          month: "short",
        });
        const amount = parseFloat(
          billing.amount?.toString().replace(/[^\d.]/g, "") || "0"
        );
        monthlyData[monthKey] =
          (monthlyData[monthKey] || 0) + (isNaN(amount) ? 0 : amount);
      });

      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      const chartData = months.map((month) => ({
        month,
        income: monthlyData[month] || 0,
      }));

      setMonthlyIncomeData(chartData);
    } else {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      setMonthlyIncomeData(months.map((month) => ({ month, income: 0 })));
    }
  }, [billings]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          title="Active Subscribers"
          value={activeSubscribers.toLocaleString()}
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Monthly Income
          </h3>
          {monthlyIncomeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyIncomeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) =>
                    `₱${typeof value === "number" ? Math.round(value).toLocaleString() : value}`
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Income (₱)"
                  dot={{ fill: "#10b981", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[250px] items-center justify-center">
              <p className="text-gray-500">No income data available</p>
            </div>
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Support Tickets Summary
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded bg-gray-50 p-4">
              <div>
                <p className="text-sm text-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalTickets}
                </p>
              </div>
              <div className="text-3xl text-blue-500">
                <Activity className="h-8 w-8" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded bg-yellow-50 p-4">
              <div>
                <p className="text-sm text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900">
                  {openTickets}
                </p>
              </div>
              <div className="text-3xl text-yellow-500">
                <AlertCircle className="h-8 w-8" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded bg-green-50 p-4">
              <div>
                <p className="text-sm text-gray-600">Resolved Tickets</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalTickets - openTickets}
                </p>
              </div>
              <div className="text-3xl text-green-500">
                <Activity className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
