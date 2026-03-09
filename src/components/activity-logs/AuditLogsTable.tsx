import type { AuditLog } from "@/models/AuditLog";
import { formatReadableDateTime } from "@saintrelion/time-functions";
import type { ColumnDef } from "@tanstack/react-table";
import { Download, Calendar, Eye } from "lucide-react";
import { DataTable } from "../general/DataTable";
import { useMemo } from "react";
import { useAuditLogsStore } from "@/stores/activity-logs/useActivityLogs";

const actionColors: Record<string, string> = {
  CREATE: "bg-green-100 text-green-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
  LOGIN: "bg-indigo-100 text-indigo-700",
  LOGOUT: "bg-gray-100 text-gray-700",
  EXECUTE: "bg-yellow-100 text-yellow-700",
  SEND: "bg-purple-100 text-purple-700",
};

const actionsList = [
  "all",
  "CREATE",
  "UPDATE",
  "DELETE",
  "LOGIN",
  "LOGOUT",
  "EXECUTE",
  "SEND",
];

const ITEMS_PER_PAGE = 20;

const ActivityLogsTable = ({ auditLogs }: { auditLogs: AuditLog[] }) => {
  const currentPage = useAuditLogsStore((s) => s.currentPage);
  const setCurrentPage = useAuditLogsStore((s) => s.setCurrentPage);

  const searchTerm = useAuditLogsStore((s) => s.searchTerm);
  const setSearchTerm = useAuditLogsStore((s) => s.setSearchTerm);

  const actionFilter = useAuditLogsStore((s) => s.actionFilter);
  const setActionFilter = useAuditLogsStore((s) => s.setActionFilter);

  const viewAuditLog = useAuditLogsStore((s) => s.viewAuditLog);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        log.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.ip_address ?? "").includes(searchTerm);

      const matchesAction =
        actionFilter === "all" || log.action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [auditLogs, searchTerm, actionFilter]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const auditLogColumns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: "created_at",
      header: "Timestamp",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="font-mono text-gray-700">
            {formatReadableDateTime(row.original.created_at)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "user",
      header: "Actor",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">
            {row.original.user ?? ""}
          </span>
          <span className="text-xs text-gray-500">{row.original.source}</span>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const action = row.original.action;
        return (
          <span
            className={`rounded-md px-2 py-1 text-xs font-medium ${
              actionColors[action] ?? "bg-gray-100 text-gray-700"
            }`}
          >
            {action}
          </span>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Resource",
      cell: ({ row }) => (
        <span className="text-gray-700 capitalize">
          {row.original.category}
        </span>
      ),
    },

    {
      accessorKey: "ip_address",
      header: "IP Address",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-gray-500">
          {row.original.ip_address ?? "-"}
        </span>
      ),
    },
    {
      id: "changes",
      header: "Changes",
      cell: ({ row }) => {
        const changes = row.original.new_data;
        if (!changes) return "-";
        const fields = Object.keys(changes).slice(0, 2);
        return (
          <div className="text-xs text-gray-600">
            {fields.map((f) => (
              <div key={f}>{f}</div>
            ))}
            {Object.keys(changes).length > 2 && (
              <div className="text-gray-400">
                +{Object.keys(changes).length - 2} more
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => viewAuditLog(row.original)}
            className="rounded-lg border p-2 hover:bg-gray-50"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(row.original, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `audit-log-${row.original.id}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="rounded-lg border p-2 hover:bg-gray-50"
            title="Download Log"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Filters */}
      <div className="mb-4 rounded-lg border bg-white p-4 shadow-sm md:p-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by resource, action, object, or IP..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            />
          </div>

          <div className="relative">
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            >
              {actionsList.map((action) => (
                <option key={action} value={action}>
                  {action === "all" ? "All Actions" : action}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <DataTable
            data={paginatedLogs}
            columns={auditLogColumns}
            showDefaultActions={false}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col gap-3 border-t px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6 md:py-4">
            <div className="text-xs text-gray-500 md:text-sm">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)} of{" "}
              {filteredLogs.length} results
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "border text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default ActivityLogsTable;
