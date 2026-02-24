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

import { DollarSign, AlertTriangle } from "lucide-react";
import { useMemo } from "react";
import type { UserBillingInfo } from "@/models/Billing";
import type { SupportTicket } from "@/models/SupportTicket";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MonthlyCards = ({
  billings,
  tickets,
}: {
  billings: UserBillingInfo[];
  tickets: SupportTicket[];
}) => {
  const monthlyIncomeData = useMemo(() => {
    if (!billings?.length) return months.map((m) => ({ month: m, income: 0 }));

    const paid = billings.filter((b) => b.status === "Paid");
    const map: Record<string, number> = {};

    paid.forEach((b) => {
      const date = new Date(b.created_at || b.due_date);
      const key = date.toLocaleString("default", { month: "short" });
      const amount = Number(b.amount?.toString().replace(/[^\d.]/g, "")) || 0;
      map[key] = (map[key] || 0) + amount;
    });

    return months.map((m) => ({ month: m, income: map[m] || 0 }));
  }, [billings]);

  const monthlyTicketsData = useMemo(() => {
    const currentMonth = new Date().toLocaleString("default", {
      month: "short",
    });

    const count = tickets?.length || 0;

    return months.map((month) => ({
      month,
      tickets: month === currentMonth ? count : 0,
    }));
  }, [tickets]);

  return (
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
  );
};
export default MonthlyCards;
