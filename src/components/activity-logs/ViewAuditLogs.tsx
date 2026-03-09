import { useAuditLogsStore } from "@/stores/activity-logs/useActivityLogs";
import { formatReadableDateTime } from "@saintrelion/time-functions";
import { Download } from "lucide-react";

const ViewAuditLogs = () => {
  const selectedAuditLog = useAuditLogsStore((s) => s.selectedAuditLog);
  const viewAuditLog = useAuditLogsStore((s) => s.viewAuditLog);

  if (!selectedAuditLog) return null;

  const {
    id,
    created_at,
    user,
    source,
    action,
    category,
    ip_address,
    new_data,
  } = selectedAuditLog;

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(selectedAuditLog, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 md:text-xl">
            Audit Log Details
          </h3>
          <button
            onClick={() => viewAuditLog(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-4 md:p-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Log ID
              </label>
              <p className="mt-1 font-mono text-gray-900">#{id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Timestamp
              </label>
              <p className="mt-1 text-gray-900">
                {formatReadableDateTime(created_at)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Actor</label>
              <p className="mt-1 text-gray-900">{user ?? source}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Action
              </label>
              <p className="mt-1 font-semibold text-gray-900">{action}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Category
              </label>
              <p className="mt-1 text-gray-900 capitalize">
                {category.replace("_", " ")}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                IP Address
              </label>
              <p className="mt-1 font-mono text-gray-900">
                {ip_address ?? "-"}
              </p>
            </div>
          </div>

          {/* New Data / Changes */}
          {new_data && Object.keys(new_data).length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Changes
              </label>
              <div className="mt-2 divide-y divide-gray-200 rounded border border-gray-200 bg-gray-50">
                {Object.entries(new_data).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between px-4 py-2 text-sm"
                  >
                    <span className="font-medium text-gray-700 capitalize">
                      {key}
                    </span>
                    <span className="font-mono text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 border-t bg-gray-50 p-4 md:flex-row md:justify-end md:gap-3 md:p-6">
          <button
            onClick={() => viewAuditLog(null)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Download className="h-4 w-4" />
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
};
export default ViewAuditLogs;
