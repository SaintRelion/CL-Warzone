import { useActivityLogsStore } from "@/stores/activity-logs/useActivityLogs";
import { formatReadableDateTime } from "@saintrelion/time-functions";
import { Download } from "lucide-react";

const ViewActivityLogs = () => {
  const selectedActivityLog = useActivityLogsStore(
    (s) => s.selectedActivityLog,
  );
  const viewActivityLog = useActivityLogsStore((s) => s.viewActivityLog);

  if (!selectedActivityLog) return <></>;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 md:text-xl">
            Activity Log Details
          </h3>
          <button
            onClick={() => viewActivityLog(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>
        <div className="p-4 md:p-6">
          <div className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Log ID
                </label>
                <p className="mt-1 font-mono text-gray-900">
                  #{selectedActivityLog.id}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Timestamp
                </label>
                <p className="mt-1 text-gray-900">
                  {formatReadableDateTime(selectedActivityLog.created_at)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  User
                </label>
                <p className="mt-1 text-gray-900">
                  {selectedActivityLog.full_name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Role
                </label>
                <p className="mt-1 text-gray-900">{selectedActivityLog.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Action
                </label>
                <p className="mt-1 font-semibold text-gray-900">
                  {selectedActivityLog.action}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Category
                </label>
                <p className="mt-1 text-gray-900 capitalize">
                  {selectedActivityLog.category.replace("_", " ")}
                </p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-500">
                  Description
                </label>
                <p className="mt-1 text-gray-900">
                  {selectedActivityLog.description}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  IP Address
                </label>
                <p className="mt-1 font-mono text-gray-900">
                  {selectedActivityLog.ip_address}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <p className="mt-1">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      selectedActivityLog.status === "success"
                        ? "bg-green-100 text-green-700"
                        : selectedActivityLog.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {selectedActivityLog.status.charAt(0).toUpperCase() +
                      selectedActivityLog.status.slice(1)}
                  </span>
                </p>
              </div>
              {selectedActivityLog.additional_info && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">
                    Additional Info
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedActivityLog.additional_info.amount && (
                      <div className="rounded-lg border bg-gray-50 px-3 py-2">
                        <span className="text-xs text-gray-500">Amount: </span>
                        <span className="font-semibold text-green-700">
                          ₱
                          {selectedActivityLog.additional_info.amount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {selectedActivityLog.additional_info.paymentMethod && (
                      <div className="rounded-lg border bg-gray-50 px-3 py-2">
                        <span className="text-xs text-gray-500">
                          Payment Method:{" "}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {selectedActivityLog.additional_info.paymentMethod}
                        </span>
                      </div>
                    )}
                    {selectedActivityLog.additional_info.planName && (
                      <div className="rounded-lg border bg-gray-50 px-3 py-2">
                        <span className="text-xs text-gray-500">Plan: </span>
                        <span className="font-semibold text-purple-700">
                          {selectedActivityLog.additional_info.planName}
                        </span>
                      </div>
                    )}
                    {selectedActivityLog.additional_info.ticketId && (
                      <div className="rounded-lg border bg-gray-50 px-3 py-2">
                        <span className="text-xs text-gray-500">
                          Ticket ID:{" "}
                        </span>
                        <span className="font-mono font-semibold text-orange-700">
                          #{selectedActivityLog.additional_info.ticketId}
                        </span>
                      </div>
                    )}
                    {selectedActivityLog.additional_info.priority && (
                      <div className="rounded-lg border bg-gray-50 px-3 py-2">
                        <span className="text-xs text-gray-500">
                          Priority:{" "}
                        </span>
                        <span
                          className={`font-semibold ${
                            selectedActivityLog.additional_info.priority ===
                            "Critical"
                              ? "text-red-700"
                              : selectedActivityLog.additional_info.priority ===
                                  "High"
                                ? "text-orange-700"
                                : "text-yellow-700"
                          }`}
                        >
                          {selectedActivityLog.additional_info.priority}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t bg-gray-50 p-4 md:flex-row md:justify-end md:gap-3 md:p-6">
          <button
            onClick={() => viewActivityLog(null)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
          <button
            onClick={() => {
              const logData = JSON.stringify(selectedActivityLog, null, 2);
              const blob = new Blob([logData], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `activity-log-${selectedActivityLog.id}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
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
export default ViewActivityLogs;
