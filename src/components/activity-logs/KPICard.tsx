import type { AuditLog } from "@/models/AuditLog";
import { Activity } from "lucide-react";

const KPICard = ({ auditLogs }: { auditLogs: AuditLog[] }) => {
  const total = auditLogs.length;

  const userEvents = auditLogs.filter((l) => l.source === "user").length;
  const systemEvents = auditLogs.filter((l) =>
    l.source.includes("system:"),
  ).length;

  const criticalEvents = auditLogs.filter(
    (l) => l.action === "DELETE" || l.action === "EXECUTE",
  ).length;

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4 lg:gap-6">
      {/* Total Logs */}
      <div className="rounded-lg border bg-white p-3 shadow-sm md:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 md:text-sm">Total Events</p>
            <p className="text-xl font-bold text-gray-900 md:text-2xl">
              {total}
            </p>
          </div>

          <Activity className="h-6 w-6 text-indigo-600 md:h-8 md:w-8" />
        </div>
      </div>

      {/* User Actions */}
      <div className="rounded-lg border bg-white p-3 shadow-sm md:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 md:text-sm">User Actions</p>
            <p className="text-xl font-bold text-blue-600 md:text-2xl">
              {userEvents}
            </p>
          </div>

          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 md:h-8 md:w-8">
            👤
          </div>
        </div>
      </div>

      {/* System Events */}
      <div className="rounded-lg border bg-white p-3 shadow-sm md:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 md:text-sm">System Events</p>
            <p className="text-xl font-bold text-gray-700 md:text-2xl">
              {systemEvents}
            </p>
          </div>

          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 md:h-8 md:w-8">
            ⚙️
          </div>
        </div>
      </div>

      {/* Critical Actions */}
      <div className="rounded-lg border bg-white p-3 shadow-sm md:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 md:text-sm">Critical Actions</p>
            <p className="text-xl font-bold text-red-600 md:text-2xl">
              {criticalEvents}
            </p>
          </div>

          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 md:h-8 md:w-8">
            ⚠️
          </div>
        </div>
      </div>
    </div>
  );
};
export default KPICard;
