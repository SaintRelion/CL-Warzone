import { DataTable } from "@/components/admin/DataTable";
import type { ClientSubscription } from "@/models/Subscription";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { formatReadableDateTime } from "@saintrelion/time-functions";
import type { ColumnDef } from "@tanstack/react-table";
import { useState, useMemo } from "react";

const SubscribersPage = () => {
  const { useList: getSubscriptions } =
    useResourceLocked<ClientSubscription>("usersubscriptions");
  const subscriptions = getSubscriptions().data;

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  // const [deleteTarget, setDeleteTarget] = useState(null);
  const itemsPerPage = 20;

  // Calculate stats
  const totalSubscribers = subscriptions.length;
  const activeSubscribers = subscriptions.filter(
    (s) => s.status === "Active",
  ).length;
  const totalBalance = subscriptions.reduce(
    (sum, s) => sum + parseFloat(s.amount),
    0,
  );

  // Filter by search term
  const filteredSubscriptions = useMemo(() => {
    let result = [...subscriptions];

    if (searchTerm) {
      result = result.filter(
        (subscription) =>
          subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subscription.address
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          subscription.planId.includes(searchTerm) ||
          subscription.id.toString().includes(searchTerm),
      );
    }

    return result;
  }, [subscriptions, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const paginatedSubscriptions = filteredSubscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const subscriptionColumns: ColumnDef<ClientSubscription>[] = [
    {
      accessorKey: "name",
      header: "Subscriber Name",
      cell: ({ getValue }) => (
        <span className="text-sm font-medium text-gray-900">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "planId",
      header: "Plan",
      cell: ({ getValue }) => (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
          Plan {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const val = getValue<string>();
        const statusConfig = {
          Active: { bg: "bg-green-100", text: "text-green-800" },
          Suspended: { bg: "bg-red-100", text: "text-red-800" },
          Inactive: { bg: "bg-gray-100", text: "text-gray-800" },
        };
        const config =
          statusConfig[val as keyof typeof statusConfig] ||
          statusConfig.Inactive;

        return (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}
          >
            {val}
          </span>
        );
      },
    },
    {
      accessorKey: "amount",
      header: () => (
        <div className="group relative inline-flex cursor-help items-center gap-1">
          <span>Outstanding Balance</span>
          <span className="text-gray-400">ⓘ</span>
          <div className="absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 rounded bg-gray-900 px-3 py-2 text-xs whitespace-nowrap text-white group-hover:block">
            Sum of unpaid balances from subscriber
          </div>
        </div>
      ),
      cell: ({ getValue }) => (
        <span className="font-semibold text-gray-900">
          ₱
          {parseFloat(getValue<string>()).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-600">📍 {getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "nextBillingDate",
      header: "Next Billing",
      cell: ({ getValue }) => {
        const dateStr = getValue<string>();
        const isValidDate = !dateStr.includes("90") && !dateStr.includes("00");
        if (!isValidDate) {
          return (
            <span className="rounded bg-red-50 px-2 py-1 text-sm font-medium text-red-600">
              ⚠️ Invalid date
            </span>
          );
        }
        return (
          <span className="text-sm font-medium text-gray-700">
            📅 {formatReadableDateTime(dateStr)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
                  Total Subscribers
                </p>
                <p className="mt-2 text-3xl font-black text-blue-900">
                  {totalSubscribers}
                </p>
              </div>
              <div className="text-4xl opacity-20">👥</div>
            </div>
          </div>

          <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-green-600 uppercase">
                  Active Subscribers
                </p>
                <p className="mt-2 text-3xl font-black text-green-900">
                  {activeSubscribers}
                </p>
              </div>
              <div className="text-4xl opacity-20">✓</div>
            </div>
          </div>

          <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-purple-600 uppercase">
                  Total Balance
                </p>
                <p className="mt-2 text-3xl font-black text-purple-900">
                  ₱
                  {totalBalance.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="text-4xl opacity-20">💰</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by ID, user, address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <DataTable
            type="Subcribers"
            data={paginatedSubscriptions}
            columns={subscriptionColumns}
            getRowId={(row) => row.id}
          />
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between rounded-lg border bg-white px-4 py-3 shadow-sm">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded border px-3 py-1 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded px-3 py-1 text-sm font-medium transition-all ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded border px-3 py-1 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL
        {showDeleteModal && deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="text-2xl">⚠️</span>
              </div>

              <h2 className="mb-2 text-xl font-black text-gray-900">
                Deactivate Subscription?
              </h2>
              <p className="mb-6 text-sm text-gray-600">
                Are you sure you want to deactivate the subscription for{" "}
                <strong>subscriber #{deleteTarget.id}</strong>? This action
                cannot be undone. The subscriber will lose access to their
                service.
              </p>

              <div className="mb-6 rounded-lg bg-gray-50 p-3 text-sm">
                <p className="text-gray-700">
                  <span className="font-semibold">Plan:</span> Plan{" "}
                  {deleteTarget.planId} |{" "}
                  <span className="font-semibold">Status:</span>{" "}
                  {deleteTarget.status}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert(
                      `✓ Subscription #${deleteTarget.id} has been deactivated.`,
                    );
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                  }}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-red-700 active:scale-95"
                >
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};
export default SubscribersPage;
