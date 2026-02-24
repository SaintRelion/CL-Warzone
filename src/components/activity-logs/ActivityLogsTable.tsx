import type { ActivityLog } from "@/models/ActivityLog";
import { formatReadableDateTime } from "@saintrelion/time-functions";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Activity,
  Download,
  FileText,
  DollarSign,
  Users,
  Shield,
  Calendar,
  Search,
  Filter,
  Eye,
  RotateCcw,
} from "lucide-react";
import { DataTable } from "../general/DataTable";
import { useMemo } from "react";
import { useActivityLogsStore } from "@/stores/activity-logs/useActivityLogs";

const categories = [
  { value: "all", label: "All Categories", icon: Activity },
  { value: "user_management", label: "User Management", icon: Users },
  { value: "billing", label: "Billing & Payments", icon: DollarSign },
  { value: "subscription", label: "Subscriptions", icon: FileText },
  { value: "support", label: "Support Tickets", icon: Shield },
  { value: "reports", label: "Reports", icon: FileText },
];

const ActivityLogsTable = ({
  activityLogs,
}: {
  activityLogs: ActivityLog[];
}) => {
  const currentPage = useActivityLogsStore((s) => s.currentPage);
  const setCurrentPage = useActivityLogsStore((s) => s.setCurrentPage);

  const searchTerm = useActivityLogsStore((s) => s.searchTerm);
  const setSearchTerm = useActivityLogsStore((s) => s.setSearchTerm);

  const categoryFilter = useActivityLogsStore((s) => s.categoryFilter);
  const setCategoryFilter = useActivityLogsStore((s) => s.setCategoryFilter);

  const statusFilter = useActivityLogsStore((s) => s.statusFilter);
  const setStatusFilter = useActivityLogsStore((s) => s.setStatusFilter);

  const viewActivityLog = useActivityLogsStore((s) => s.viewActivityLog);

  const itemsPerPage = 20;

  const filteredLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      const matchesSearch =
        log.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip_address.includes(searchTerm);

      const matchesCategory =
        categoryFilter === "all" || log.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" || log.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [activityLogs, searchTerm, categoryFilter, statusFilter]);

  // Pagination
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const activityLogsColumn: ColumnDef<ActivityLog>[] = [
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
      header: "User",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.original.full_name}
          </div>
          <div className="text-xs text-gray-500">{row.original.role}</div>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="font-medium text-gray-800">{row.original.action}</div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = categories.find(
          (c) => c.value === row.original.category,
        );
        const Icon = category?.icon || Activity;
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-indigo-600" />
            <span className="text-sm text-gray-700 capitalize">
              {row.original.category.replace("_", " ")}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => viewActivityLog(row.original)}
            className="rounded-lg border border-gray-300 p-2 text-gray-600 transition hover:bg-gray-50 hover:text-indigo-600"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              const logData = JSON.stringify(row.original, null, 2);
              const blob = new Blob([logData], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `activity-log-${row.original.id}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="rounded-lg border border-gray-300 p-2 text-gray-600 transition hover:bg-gray-50 hover:text-green-600"
            title="Export Log"
          >
            <Download className="h-4 w-4" />
          </button>
          {row.original.status === "failed" && (
            <button
              onClick={() => {
                alert(`Retry action for log #${row.original.id}`);
              }}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 transition hover:bg-gray-50 hover:text-blue-600"
              title="Retry Action"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Filters */}
      <div className="rounded-lg border bg-white p-4 shadow-sm md:p-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user, action, or IP..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full appearance-none rounded-lg border border-gray-300 py-2 pr-10 pl-10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="warning">Warning</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <DataTable
            data={paginatedLogs}
            columns={activityLogsColumn}
            showDefaultActions={false}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col gap-3 border-t px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6 md:py-4">
            <div className="text-xs text-gray-500 md:text-sm">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of{" "}
              {filteredLogs.length} results
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 md:px-4 md:py-2 md:text-sm"
              >
                Previous
              </button>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium md:px-4 md:py-2 md:text-sm ${
                        currentPage === page
                          ? "bg-indigo-600 text-white"
                          : "border text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 md:px-4 md:py-2 md:text-sm"
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
