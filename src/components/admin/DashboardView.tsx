import { StatCard } from "./StatCard";
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
  Activity,
  AlertCircle,
  DollarSign,
  Signal,
  Users,
  WifiOff,
} from "lucide-react";

export const DashboardView = () => {
  const bandwidthData = [
    { time: "00:00", upload: 45, download: 120 },
    { time: "04:00", upload: 30, download: 80 },
    { time: "08:00", upload: 95, download: 280 },
    { time: "12:00", upload: 110, download: 320 },
    { time: "16:00", upload: 130, download: 380 },
    { time: "20:00", upload: 150, download: 420 },
    { time: "23:59", upload: 85, download: 250 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          title="Active Subscribers"
          value="1,175"
          color="blue"
        />
        <StatCard
          icon={DollarSign}
          title="Revenue (Nov)"
          value="₱338K"
          color="green"
        />
        <StatCard
          icon={AlertCircle}
          title="Open Tickets"
          value="47"
          color="yellow"
        />
        <StatCard
          icon={Activity}
          title="Network Load"
          value="68%"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            24-Hour Bandwidth Usage
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={bandwidthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="download"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Download (Mbps)"
              />
              <Line
                type="monotone"
                dataKey="upload"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Upload (Mbps)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Recent Alerts
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3 rounded border-l-4 border-red-500 bg-red-50 p-3">
              <WifiOff className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Router R-07 Offline
                </div>
                <div className="text-xs text-gray-500">2 minutes ago</div>
              </div>
            </div>
            <div className="flex gap-3 rounded border-l-4 border-yellow-500 bg-yellow-50 p-3">
              <Signal className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-500" />
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  High Latency Detected
                </div>
                <div className="text-xs text-gray-500">15 minutes ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
