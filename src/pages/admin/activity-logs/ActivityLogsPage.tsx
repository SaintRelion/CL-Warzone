import { useState, useMemo } from "react";
import { DataTable } from "@/components/admin/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Activity,
  User,
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

interface ActivityLog {
  id: number;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  category: string;
  description: string;
  ipAddress: string;
  status: "success" | "failed" | "warning";
  metadata?: {
    amount?: number;
    paymentMethod?: string;
    planName?: string;
    ticketId?: string;
    priority?: string;
  };
}

const ActivityLogsPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewDetailsLog, setViewDetailsLog] = useState<ActivityLog | null>(null);
  const itemsPerPage = 20;

  // Mock data aligned with actual system operations
  const mockActivityLogs: ActivityLog[] = [
    {
      id: 1,
      timestamp: "2026-01-08 14:32:15",
      user: "Admin Juan",
      userRole: "Admin",
      action: "Payment Processed",
      category: "billing",
      description: "Processed GCash payment ₱1,500 for Juan dela Cruz - Plan: Fiber 50Mbps",
      ipAddress: "192.168.1.100",
      status: "success",
      metadata: { amount: 1500, paymentMethod: "GCash", planName: "Fiber 50Mbps" },
    },
    {
      id: 2,
      timestamp: "2026-01-08 14:28:42",
      user: "Maria Santos",
      userRole: "Client",
      action: "Cash Payment Submitted",
      category: "billing",
      description: "Cash payment received ₱999 - Plan: Basic 25Mbps. Change: ₱1",
      ipAddress: "203.177.42.89",
      status: "success",
      metadata: { amount: 999, paymentMethod: "Cash", planName: "Basic 25Mbps" },
    },
    {
      id: 3,
      timestamp: "2026-01-08 14:15:33",
      user: "Admin Juan",
      userRole: "Admin",
      action: "Subscription Updated",
      category: "subscription",
      description: "Upgraded Carlos Mendoza from Basic 25Mbps to Premium 100Mbps - Next billing: Jan 15, 2026",
      ipAddress: "192.168.1.100",
      status: "success",
      metadata: { planName: "Premium 100Mbps" },
    },
    {
      id: 4,
      timestamp: "2026-01-08 13:58:21",
      user: "System Auto",
      userRole: "System",
      action: "Critical Ticket Created",
      category: "support",
      description: "Auto-generated ticket #1045 for Pedro Reyes - Issue: No Connection | Priority: Critical",
      ipAddress: "127.0.0.1",
      status: "warning",
      metadata: { ticketId: "1045", priority: "Critical" },
    },
    {
      id: 5,
      timestamp: "2026-01-08 13:45:10",
      user: "Lisa Tan",
      userRole: "Client",
      action: "Login Failed",
      category: "security",
      description: "Failed login attempt - Incorrect password (3rd attempt)",
      ipAddress: "180.190.45.12",
      status: "failed",
    },
    {
      id: 6,
      timestamp: "2026-01-08 13:30:05",
      user: "Admin Maria",
      userRole: "Admin",
      action: "Billing Settings Modified",
      category: "system",
      description: "Updated due date grace period from 5 days to 7 days",
      ipAddress: "192.168.1.101",
      status: "success",
    },
    {
      id: 7,
      timestamp: "2026-01-08 13:12:44",
      user: "Robert Santos",
      userRole: "Client",
      action: "Plan Change Requested",
      category: "subscription",
      description: "Requested downgrade from Premium 100Mbps to Standard 50Mbps - Effective: Next billing cycle",
      ipAddress: "202.90.143.77",
      status: "warning",
      metadata: { planName: "Standard 50Mbps" },
    },
    {
      id: 8,
      timestamp: "2026-01-08 12:55:33",
      user: "Admin Juan",
      userRole: "Admin",
      action: "Account Suspended",
      category: "user_management",
      description: "Suspended Patricia Flores account - Reason: Overdue payment (45 days)",
      ipAddress: "192.168.1.100",
      status: "success",
    },
    {
      id: 9,
      timestamp: "2026-01-08 12:40:22",
      user: "Michael Torres",
      userRole: "Client",
      action: "Support Ticket Opened",
      category: "support",
      description: "Created ticket #1046 - Issue: Slow Browsing | Priority: High | Assigned: Tech-02",
      ipAddress: "112.200.55.34",
      status: "success",
      metadata: { ticketId: "1046", priority: "High" },
    },
    {
      id: 10,
      timestamp: "2026-01-08 12:25:11",
      user: "Jennifer Lopez",
      userRole: "Client",
      action: "Bank Transfer Verified",
      category: "billing",
      description: "Bank transfer payment ₱1,200 verified - Ref: BT20260108125 - Plan: Standard 50Mbps",
      ipAddress: "124.105.88.21",
      status: "success",
      metadata: { amount: 1200, paymentMethod: "Bank Transfer", planName: "Standard 50Mbps" },
    },
    {
      id: 11,
      timestamp: "2026-01-08 11:58:00",
      user: "Admin Maria",
      userRole: "Admin",
      action: "Monthly Report Generated",
      category: "reports",
      description: "Generated December 2025 revenue report - Total: ₱338,000 | Active subscribers: 1,175",
      ipAddress: "192.168.1.101",
      status: "success",
    },
    {
      id: 12,
      timestamp: "2026-01-08 11:42:15",
      user: "David Reyes",
      userRole: "Client",
      action: "Account Details Updated",
      category: "user_management",
      description: "Updated contact info - New phone: +63 917 123 4567 | Email: david.reyes@email.com",
      ipAddress: "210.213.77.99",
      status: "success",
    },
    {
      id: 13,
      timestamp: "2026-01-08 11:20:30",
      user: "System Auto",
      userRole: "System",
      action: "Database Backup",
      category: "system",
      description: "Daily automated database backup completed - Size: 2.3GB | Duration: 8 minutes",
      ipAddress: "127.0.0.1",
      status: "success",
    },
    {
      id: 14,
      timestamp: "2026-01-08 10:55:45",
      user: "Angela Martinez",
      userRole: "Client",
      action: "Mobile Login",
      category: "security",
      description: "Successful login from Android device - Location: Makati City",
      ipAddress: "175.176.88.54",
      status: "success",
    },
    {
      id: 15,
      timestamp: "2026-01-08 10:30:12",
      user: "Admin Juan",
      userRole: "Admin",
      action: "New Subscriber Added",
      category: "user_management",
      description: "Created account for Christopher Lee - Plan: Basic 25Mbps | Installation: Jan 12, 2026",
      ipAddress: "192.168.1.100",
      status: "success",
      metadata: { planName: "Basic 25Mbps" },
    },
    {
      id: 16,
      timestamp: "2026-01-08 10:15:33",
      user: "System Auto",
      userRole: "System",
      action: "Payment Failed",
      category: "billing",
      description: "Auto-debit failed for Michelle Kim - Amount: ₱1,500 | Reason: Insufficient funds",
      ipAddress: "127.0.0.1",
      status: "failed",
      metadata: { amount: 1500, paymentMethod: "Auto-debit" },
    },
    {
      id: 17,
      timestamp: "2026-01-08 09:45:22",
      user: "Admin Maria",
      userRole: "Admin",
      action: "Ticket Closed",
      category: "support",
      description: "Resolved and closed ticket #1032 for Ana Garcia - Issue: Billing Query | Resolution time: 2 hours",
      ipAddress: "192.168.1.101",
      status: "success",
      metadata: { ticketId: "1032", priority: "Medium" },
    },
    {
      id: 18,
      timestamp: "2026-01-08 09:20:11",
      user: "Daniel Cruz",
      userRole: "Client",
      action: "Invoice Downloaded",
      category: "billing",
      description: "Downloaded billing invoice for December 2025 - Amount: ₱1,500 (PDF)",
      ipAddress: "112.201.77.88",
      status: "success",
    },
    {
      id: 19,
      timestamp: "2026-01-08 08:55:00",
      user: "System Auto",
      userRole: "System",
      action: "Payment Reminders Sent",
      category: "billing",
      description: "Sent automated payment reminders to 23 subscribers - Due dates within 3 days",
      ipAddress: "127.0.0.1",
      status: "success",
    },
    {
      id: 20,
      timestamp: "2026-01-08 08:30:45",
      user: "Sarah Johnson",
      userRole: "Client",
      action: "Password Changed",
      category: "security",
      description: "Password reset completed via email verification - Session invalidated",
      ipAddress: "220.144.99.11",
      status: "success",
    },
    {
      id: 21,
      timestamp: "2026-01-07 23:45:30",
      user: "Admin Juan",
      userRole: "Admin",
      action: "Bulk Status Update",
      category: "user_management",
      description: "Suspended 8 accounts for overdue payments exceeding 30 days",
      ipAddress: "192.168.1.100",
      status: "success",
    },
    {
      id: 22,
      timestamp: "2026-01-07 22:30:15",
      user: "Jessica Brown",
      userRole: "Client",
      action: "GCash Payment",
      category: "billing",
      description: "GCash payment ₱1,899 processed - Ref: GC20260107223 - Plan: Premium 100Mbps",
      ipAddress: "175.222.111.33",
      status: "success",
      metadata: { amount: 1899, paymentMethod: "GCash", planName: "Premium 100Mbps" },
    },
    {
      id: 23,
      timestamp: "2026-01-07 21:15:00",
      user: "Admin Maria",
      userRole: "Admin",
      action: "Promo Code Created",
      category: "marketing",
      description: "Created promo code 'NEWYEAR2026' - 20% discount for new subscribers | Valid until: Jan 31, 2026",
      ipAddress: "192.168.1.101",
      status: "success",
    },
    {
      id: 24,
      timestamp: "2026-01-07 20:00:45",
      user: "James Anderson",
      userRole: "Client",
      action: "Installation Scheduled",
      category: "subscription",
      description: "Scheduled fiber installation - Date: Jan 10, 2026 | Time: 1:00 PM - 5:00 PM | Area: Quezon City",
      ipAddress: "203.177.88.44",
      status: "success",
    },
    {
      id: 25,
      timestamp: "2026-01-07 19:30:22",
      user: "System Auto",
      userRole: "System",
      action: "Ticket Auto-Escalated",
      category: "support",
      description: "Auto-escalated ticket #1040 - Unresolved for 48 hours | Priority upgraded: High → Critical",
      ipAddress: "127.0.0.1",
      status: "warning",
      metadata: { ticketId: "1040", priority: "Critical" },
    },
  ];

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
    return mockActivityLogs.filter((log) => {
      const matchesSearch =
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm);

      const matchesCategory =
        selectedCategory === "all" || log.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "all" || log.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [mockActivityLogs, searchTerm, selectedCategory, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: ColumnDef<ActivityLog>[] = [
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="font-mono text-gray-700">{row.original.timestamp}</span>
        </div>
      ),
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.user}</div>
          <div className="text-xs text-gray-500">{row.original.userRole}</div>
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
        const category = categories.find((c) => c.value === row.original.category);
        const Icon = category?.icon || Activity;
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-indigo-600" />
            <span className="text-sm capitalize text-gray-700">
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
              <p className="text-xs text-gray-500 md:text-sm">Total Activities</p>
              <p className="text-xl font-bold text-gray-900 md:text-2xl">{filteredLogs.length}</p>
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
              <span className="text-base font-bold text-red-600 md:text-lg">✗</span>
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
              <span className="text-base font-bold text-yellow-600 md:text-lg">!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg border bg-white p-4 shadow-sm md:p-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user, action, or IP..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full appearance-none rounded-lg border border-gray-300 py-2 pl-10 pr-10 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
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
              className="w-full appearance-none rounded-lg border border-gray-300 py-2 px-4 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
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
          <DataTable columns={columns} data={paginatedLogs} showDefaultActions={false} />
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 md:text-xl">Activity Log Details</h3>
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
                    <label className="text-sm font-medium text-gray-500">Log ID</label>
                    <p className="mt-1 font-mono text-gray-900">#{viewDetailsLog.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Timestamp</label>
                    <p className="mt-1 text-gray-900">{viewDetailsLog.timestamp}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">User</label>
                    <p className="mt-1 text-gray-900">{viewDetailsLog.user}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Role</label>
                    <p className="mt-1 text-gray-900">{viewDetailsLog.userRole}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Action</label>
                    <p className="mt-1 font-semibold text-gray-900">{viewDetailsLog.action}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="mt-1 capitalize text-gray-900">
                      {viewDetailsLog.category.replace("_", " ")}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="mt-1 text-gray-900">{viewDetailsLog.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">IP Address</label>
                    <p className="mt-1 font-mono text-gray-900">{viewDetailsLog.ipAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
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
                  {viewDetailsLog.metadata && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">Additional Info</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {viewDetailsLog.metadata.amount && (
                          <div className="rounded-lg border bg-gray-50 px-3 py-2">
                            <span className="text-xs text-gray-500">Amount: </span>
                            <span className="font-semibold text-green-700">
                              ₱{viewDetailsLog.metadata.amount.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {viewDetailsLog.metadata.paymentMethod && (
                          <div className="rounded-lg border bg-gray-50 px-3 py-2">
                            <span className="text-xs text-gray-500">Payment Method: </span>
                            <span className="font-semibold text-gray-900">
                              {viewDetailsLog.metadata.paymentMethod}
                            </span>
                          </div>
                        )}
                        {viewDetailsLog.metadata.planName && (
                          <div className="rounded-lg border bg-gray-50 px-3 py-2">
                            <span className="text-xs text-gray-500">Plan: </span>
                            <span className="font-semibold text-purple-700">
                              {viewDetailsLog.metadata.planName}
                            </span>
                          </div>
                        )}
                        {viewDetailsLog.metadata.ticketId && (
                          <div className="rounded-lg border bg-gray-50 px-3 py-2">
                            <span className="text-xs text-gray-500">Ticket ID: </span>
                            <span className="font-mono font-semibold text-orange-700">
                              #{viewDetailsLog.metadata.ticketId}
                            </span>
                          </div>
                        )}
                        {viewDetailsLog.metadata.priority && (
                          <div className="rounded-lg border bg-gray-50 px-3 py-2">
                            <span className="text-xs text-gray-500">Priority: </span>
                            <span
                              className={`font-semibold ${
                                viewDetailsLog.metadata.priority === "Critical"
                                  ? "text-red-700"
                                  : viewDetailsLog.metadata.priority === "High"
                                    ? "text-orange-700"
                                    : "text-yellow-700"
                              }`}
                            >
                              {viewDetailsLog.metadata.priority}
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
                  const blob = new Blob([logData], { type: "application/json" });
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
