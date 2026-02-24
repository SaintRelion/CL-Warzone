import { useResourceLocked } from "@saintrelion/data-access-layer";
import type { ActivityLog } from "@/models/ActivityLog";
import ActivityLogsTable from "@/components/activity-logs/ActivityLogsTable";
import KPICard from "@/components/activity-logs/KPICard";
import ViewActivityLogs from "@/components/activity-logs/ViewActivityLogs";
import { sortByTime } from "@saintrelion/time-functions";

const ActivityLogsPage = () => {
  const { useList: getActivityLogs } =
    useResourceLocked<ActivityLog>("activitylog");
  const activityLogs = sortByTime(getActivityLogs().data, "created_at");

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
          Activity Logs
        </h1>
        <p className="text-xs text-gray-500 md:text-sm">
          Track all user actions, system events, and administrative changes
        </p>
      </div>

      {/* Stats Cards */}
      <KPICard activityLogs={activityLogs} />

      {/* Table Data */}
      <ActivityLogsTable activityLogs={activityLogs} />

      {/* View Details Modal */}
      <ViewActivityLogs />
    </div>
  );
};

export default ActivityLogsPage;
