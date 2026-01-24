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
  BarChart,
  Bar,
} from "recharts";
import {
  Users,
  DollarSign,
  AlertTriangle,
  AlertCircle,
  Activity,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import type { BillingInfo } from "@/models/Billing";
import type { ClientTicket } from "@/models/Tickets";

export const AdminDashboardPage = () => {
  const { useList: getSubscriptions } = useResourceLocked("subscription");
  const subcriptions = getSubscriptions({ filters: { status: "Active" } }).data;

  // const { useList: getUsers } = useResourceLocked("user");
  // const users = getUsers({}).data;

  const { useList: getTickets } = useResourceLocked<ClientTicket>("tickets");
  const tickets = getTickets({}).data;

  const { useList: getBillings } = useResourceLocked<BillingInfo>("userbillings");
  const billings = getBillings({}).data;

  const [monthlyIncomeData, setMonthlyIncomeData] = useState<
    { month: string; income: number }[]
  >([]);
  const [monthlyTicketsData, setMonthlyTicketsData] = useState<
    { month: string; tickets: number }[]
  >([]);

  const totalUsers = subcriptions?.length || 0;
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
  // const currentMonthIncome = monthlyIncomeData.length > 0
  //   ? monthlyIncomeData[monthlyIncomeData.length - 1]?.income || 0
  //   : 0;

  useEffect(() => {
    console.log("All billings:", billings);
    const paidBillings = billings?.filter(b => b.status === "Paid") || [];
    console.log("Paid billings:", paidBillings);
    
    if (paidBillings.length > 0) {
      const monthlyData: { [key: string]: number } = {};
      
      paidBillings.forEach((billing: BillingInfo) => {
        // Use createdAt or nextBillingDate as fallback
        const dateStr = billing.createdAt || billing.nextBillingDate;
        console.log("Billing date string:", dateStr, "Amount:", billing.amount);
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

      console.log("Monthly income data:", monthlyData);
      
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
      // Show empty chart with months
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      setMonthlyIncomeData(months.map((month) => ({ month, income: 0 })));
    }
  }, [billings]);

  useEffect(() => {
    console.log("All tickets:", tickets);
    
    // Since ClientTicket doesn't have createdAt, show total tickets in current month
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const currentMonth = new Date().toLocaleString("default", { month: "short" });
    const chartData = months.map((month) => ({
      month,
      tickets: month === currentMonth ? (tickets?.length || 0) : 0,
    }));
    
    setMonthlyTicketsData(chartData);
  }, [tickets]);

  return (
    <div className="space-y-10">
      {/* ===================== PAGE HEADER ===================== */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Network Operations Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Enterprise overview of subscribers, revenue, network health, and
          incidents
        </p>
      </div>

      {/* ===================== KPI ROW ===================== */}
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

      {/* ===================== ANALYTICS ===================== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* MONTHLY INCOME */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
              Monthly Income
            </h3>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </div>

          {monthlyIncomeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
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
            <div className="flex h-65 items-center justify-center">
              <p className="text-gray-500">No income data available</p>
            </div>
          )}
        </div>

        {/* MONTHLY TICKETS */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
              Monthly Tickets
            </h3>
            <AlertTriangle className="h-4 w-4 text-gray-400" />
          </div>

          {monthlyTicketsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyTicketsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="tickets"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  name="Tickets"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-65 items-center justify-center">
              <p className="text-gray-500">No ticket data available</p>
            </div>
          )}
        </div>
      </div>

      {/* ===================== OPERATIONS ===================== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* TICKETS SUMMARY */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-700 uppercase">
            Tickets Summary
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
              <div>
                <p className="text-sm text-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{totalTickets}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-4">
              <div>
                <p className="text-sm text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{openTickets}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
              <div>
                <p className="text-sm text-gray-600">Resolved Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{totalTickets - openTickets}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

      
      </div>
    </div>
  );
};
