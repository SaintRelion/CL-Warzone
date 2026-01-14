import { useState, useMemo } from "react";
import { DataTable } from "@/components/admin/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Activity,
  FileText,
  Settings,
  DollarSign,
  Users,
  Shield,
  Calendar,
  Search,
  Filter,
  Eye,
  Download,
  RotateCcw,
} from "lucide-react";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import type { ActivityLog } from "@/models/ActivityLog";
import { formatReadableDateTime } from "@saintrelion/time-functions";

const ActivityLogsPage = () => {
  const { useList: getActivityLogs } =
    useResourceLocked<ActivityLog>("activitylog");
  const activityLogs = getActivityLogs().data;

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewDetailsLog, setViewDetailsLog] = useState<ActivityLog | null>(
    null,
  );
  const itemsPerPage = 20;

  const categories = [
    { value: "all", label: "All Categories", icon: Activity },
    { value: "user_management", label: "User Management", icon: Users },
    { value: "billing", label: "Billing & Payments", icon: DollarSign },
    { value: "subscription", label: "Subscriptions", icon: FileText },
    { value: "support", label: "Support Tickets", icon: Shield },
    { value: "security", label: "Security & Auth", icon: Shield },
    { value: "system", label: "System Operations", icon: Settings },
    { value: "marketing", label: "Marketing", icon: Activity },
    { value: "reports", label: "Reports", icon: FileText },
  ];

  // Filter logs based on search term, category, and status
  const filteredLogs = useMemo(() => {
    return !activityLogs
      ? []
      : activityLogs.filter((log) => {
          const matchesSearch =
            log.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.ipAddress.includes(searchTerm);

          const matchesCategory =
            selectedCategory === "all" || log.category === selectedCategory;

          const matchesStatus =
            selectedStatus === "all" || log.status === selectedStatus;

          return matchesSearch && matchesCategory && matchesStatus;
        });
  }, [activityLogs, searchTerm, selectedCategory, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const columns: ColumnDef<ActivityLog>[] = [
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="font-mono text-gray-700">
            {formatReadableDateTime(row.original.createdAt)}
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
            {row.original.fullName}
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
            onClick={() => setViewDetailsLog(row.original)}
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
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4 lg:gap-6">
        <div className="rounded-lg border bg-white p-3 shadow-sm md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 md:text-sm">
                Total Activities
              </p>
              <p className="text-xl font-bold text-gray-900 md:text-2xl">
                {filteredLogs.length}
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
                {filteredLogs.filter((log) => log.status === "success").length}
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
                {filteredLogs.filter((log) => log.status === "failed").length}
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
              <p className="text-xs text-gray-500 md:text-sm">Warnings</p>
              <p className="text-xl font-bold text-yellow-600 md:text-2xl">
                {filteredLogs.filter((log) => log.status === "warning").length}
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
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
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
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
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
            columns={columns}
            data={paginatedLogs}
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
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
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

      {/* View Details Modal */}
      {viewDetailsLog && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 md:text-xl">
                Activity Log Details
              </h3>
              <button
                onClick={() => setViewDetailsLog(null)}
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
                      #{viewDetailsLog.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Timestamp
                    </label>
                    <p className="mt-1 text-gray-900">
                      {formatReadableDateTime(viewDetailsLog.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      User
                    </label>
                    <p className="mt-1 text-gray-900">
                      {viewDetailsLog.fullName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Role
                    </label>
                    <p className="mt-1 text-gray-900">{viewDetailsLog.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Action
                    </label>
                    <p className="mt-1 font-semibold text-gray-900">
                      {viewDetailsLog.action}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Category
                    </label>
                    <p className="mt-1 text-gray-900 capitalize">
                      {viewDetailsLog.category.replace("_", " ")}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">
                      Description
                    </label>
                    <p className="mt-1 text-gray-900">
                      {viewDetailsLog.description}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      IP Address
                    </label>
                    <p className="mt-1 font-mono text-gray-900">
                      {viewDetailsLog.ipAddress}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <p className="mt-1">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          viewDetailsLog.status === "success"
                            ? "bg-green-100 text-green-700"
                            : viewDetailsLog.status === "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {viewDetailsLog.status.charAt(0).toUpperCase() +
                          viewDetailsLog.status.slice(1)}
                      </span>
                    </p>
                  </div>
                  {viewDetailsLog.additionalInfo && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">
                        Additional Info
                      </label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {viewDetailsLog.additionalInfo.amount && (
                          <div className="rounded-lg border bg-gray-50 px-3 py-2">
                            <span className="text-xs text-gray-500">
                              Amount:{" "}
                            </span>
                            <span className="font-semibold text-green-700">
                              ₱
                              {viewDetailsLog.additionalInfo.amount.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {viewDetailsLog.additionalInfo.paymentMethod && (
                          <div className="rounded-lg border bg-gray-50 px-3 py-2">
                            <span className="text-xs text-gray-500">
                              Payment Method:{" "}
                            </span>
                            <span className="font-semibold text-gray-900">
                              {viewDetailsLog.additionalInfo.paymentMethod}
                            </span>
                          </div>
                        )}
                        {viewDetailsLog.additionalInfo.planName && (
                          <div className="rounded-lg border bg-gray-50 px-3 py-2">
                            <span className="text-xs text-gray-500">
                              Plan:{" "}
                            </span>
                            <span className="font-semibold text-purple-700">
                              {viewDetailsLog.additionalInfo.planName}
                            </span>
                          </div>
                        )}
                        {viewDetailsLog.additionalInfo.ticketId && (
                          <div className="rounded-lg border bg-gray-50 px-3 py-2">
                            <span className="text-xs text-gray-500">
                              Ticket ID:{" "}
                            </span>
                            <span className="font-mono font-semibold text-orange-700">
                              #{viewDetailsLog.additionalInfo.ticketId}
                            </span>
                          </div>
                        )}
                        {viewDetailsLog.additionalInfo.priority && (
                          <div className="rounded-lg border bg-gray-50 px-3 py-2">
                            <span className="text-xs text-gray-500">
                              Priority:{" "}
                            </span>
                            <span
                              className={`font-semibold ${
                                viewDetailsLog.additionalInfo.priority ===
                                "Critical"
                                  ? "text-red-700"
                                  : viewDetailsLog.additionalInfo.priority ===
                                      "High"
                                    ? "text-orange-700"
                                    : "text-yellow-700"
                              }`}
                            >
                              {viewDetailsLog.additionalInfo.priority}
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
                onClick={() => setViewDetailsLog(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const logData = JSON.stringify(viewDetailsLog, null, 2);
                  const blob = new Blob([logData], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `activity-log-${viewDetailsLog.id}.json`;
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
      )}
    </div>
  );
};

export default ActivityLogsPage;
