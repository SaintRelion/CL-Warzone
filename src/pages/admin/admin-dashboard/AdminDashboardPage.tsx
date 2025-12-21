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
  WifiOff,
  Signal,
  Server,
  FileBarChart,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";

export const AdminDashboardPage = () => {
  const bandwidthData = [
    { time: "00:00", upload: 45, download: 120 },
    { time: "04:00", upload: 30, download: 80 },
    { time: "08:00", upload: 95, download: 280 },
    { time: "12:00", upload: 110, download: 320 },
    { time: "16:00", upload: 130, download: 380 },
    { time: "20:00", upload: 150, download: 420 },
    { time: "23:59", upload: 85, download: 250 },
  ];

  const ticketSeverity = [
    { name: "Low", count: 12 },
    { name: "Medium", count: 18 },
    { name: "High", count: 11 },
    { name: "Critical", count: 6 },
  ];

  return (
    <div className="space-y-10">
      {/* ===================== PAGE HEADER ===================== */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Network Operations Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Enterprise overview of subscribers, revenue, network health, and incidents
        </p>
      </div>

      {/* ===================== KPI ROW ===================== */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} title="Active Subscribers" value="1,175" color="blue" />
        <StatCard icon={DollarSign} title="Monthly Revenue" value="₱338,000" color="green" />
        <StatCard icon={AlertTriangle} title="Open Incidents" value="47" color="yellow" />
        <StatCard icon={WifiOff} title="Network Outages" value="3" color="red" />
      </div>

      {/* ===================== ANALYTICS ===================== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* BANDWIDTH */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
              Bandwidth Utilization (24h)
            </h3>
            <Signal className="h-4 w-4 text-gray-400" />
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={bandwidthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="download"
                stroke="#334155"
                strokeWidth={2}
                name="Download"
              />
              <Line
                type="monotone"
                dataKey="upload"
                stroke="#6366f1"
                strokeWidth={2}
                name="Upload"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* INCIDENT SEVERITY */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
              Incident Severity
            </h3>
            <AlertTriangle className="h-4 w-4 text-gray-400" />
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ticketSeverity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#475569"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===================== OPERATIONS ===================== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* LIVE ALERTS */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
            Live Network Alerts
          </h3>

          <div className="space-y-3">
            <div className="flex gap-3 rounded-lg border-l-4 border-red-600 bg-red-50 p-3">
              <Server className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Core Router R-07 Offline
                </div>
                <div className="text-xs text-gray-500">
                  Detected 2 minutes ago · SLA risk
                </div>
              </div>
            </div>

            <div className="flex gap-3 rounded-lg border-l-4 border-emerald-600 bg-emerald-50 p-3">
              <Signal className="h-5 w-5 text-emerald-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Payment Received – John Dela Cruz
                </div>
                <div className="text-xs text-gray-500">
                  15 minutes ago · Account settled
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EXEC ACTIONS */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
            Administrative Actions
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button className="flex items-center gap-3 rounded-lg border p-4 hover:bg-gray-50">
              <Server className="h-5 w-5 text-indigo-600" />
              <div>
                <div className="text-sm font-semibold">Network Management</div>
                <div className="text-xs text-gray-500">
                  Diagnostics & routing
                </div>
              </div>
            </button>

            <button className="flex items-center gap-3 rounded-lg border p-4 hover:bg-gray-50">
              <FileBarChart className="h-5 w-5 text-indigo-600" />
              <div>
                <div className="text-sm font-semibold">Executive Reports</div>
                <div className="text-xs text-gray-500">
                  Financial & usage data
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
