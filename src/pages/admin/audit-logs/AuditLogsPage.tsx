import type { AuditLog } from "@/models/AuditLog";
import KPICard from "@/components/activity-logs/KPICard";
import { apiRequest } from "@/pages/to-be-library/sr-api";
import { BASE_API } from "@/sr-config";
import { useEffect, useState } from "react";
import AuditLogsTable from "@/components/activity-logs/AuditLogsTable";
import ViewAuditLogs from "@/components/activity-logs/ViewAuditLogs";

const getAuditLogs = async (params?: {
  action?: string;
  category?: string;
  source?: string;
  user?: string;
  search?: string;
  ordering?: string;
  page?: number;
}) => {
  const query = params
    ? `?${new URLSearchParams(
        Object.entries(params).reduce(
          (acc, [key, value]) => {
            if (value !== undefined && value !== null) {
              acc[key] = String(value);
            }
            return acc;
          },
          {} as Record<string, string>,
        ),
      ).toString()}`
    : "";

  return apiRequest(`${BASE_API}api/auditlogs/${query}`, undefined, {
    method: "GET",
  });
};

const AuditLogsPage = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const result = await getAuditLogs({
        ordering: "-created_at",
      });

      setAuditLogs(result);
    };

    fetchLogs();
  }, []);

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
          Audit Logs
        </h1>

        <p className="text-xs text-gray-500 md:text-sm">
          Monitor system activity, user actions, and security-relevant events
        </p>
      </div>

      {/* KPI Cards */}
      <KPICard auditLogs={auditLogs} />

      {/* Table */}
      <AuditLogsTable auditLogs={auditLogs} />

      {/* Details Modal */}
      <ViewAuditLogs />
    </div>
  );
};

export default AuditLogsPage;
