import type { ActivityLog } from "@/models/ActivityLog";
import { Activity } from "lucide-react";

const KPICard = ({ activityLogs }: { activityLogs: ActivityLog[] }) => {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4 lg:gap-6">
      <div className="rounded-lg border bg-white p-3 shadow-sm md:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 md:text-sm">Total Activities</p>
            <p className="text-xl font-bold text-gray-900 md:text-2xl">
              {activityLogs.length}
            </p>
          </div>
          <Activity className="h-6 w-6 text-indigo-600 md:h-8 md:w-8" />
        </div>
      </div>
      <div className="rounded-lg border bg-white p-3 shadow-sm md:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 md:text-sm">Successful</p>
            <p className="text-xl font-bold text-green-600 md:text-2xl">
              {activityLogs.filter((log) => log.status === "success").length}
            </p>
          </div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 md:h-8 md:w-8">
            <span className="text-base md:text-lg">✓</span>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-white p-3 shadow-sm md:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 md:text-sm">Failed</p>
            <p className="text-xl font-bold text-red-600 md:text-2xl">
              {activityLogs.filter((log) => log.status === "failure").length}
            </p>
          </div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 md:h-8 md:w-8">
            <span className="text-base font-bold text-red-600 md:text-lg">
              ✗
            </span>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-white p-3 shadow-sm md:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 md:text-sm">Pendings</p>
            <p className="text-xl font-bold text-yellow-600 md:text-2xl">
              {activityLogs.filter((log) => log.status === "pending").length}
            </p>
          </div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 md:h-8 md:w-8">
            <span className="text-base font-bold text-yellow-600 md:text-lg">
              !
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default KPICard;
