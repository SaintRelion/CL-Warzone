import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../general/DataTable";
import { Eye, Edit, Search } from "lucide-react";

import type { UserSubscription } from "@/models/subscription";
import { useSubscribersStore } from "@/stores/subscribers/useSubscribersStore";
import { useMemo } from "react";
import MoreMenu from "./MoreMenu";

const SubscriptionsTable = ({
  userSubscriptions,
}: {
  userSubscriptions: UserSubscription[];
}) => {
  const searchTerm = useSubscribersStore((s) => s.searchTerm);
  const setSearchTerm = useSubscribersStore((s) => s.setSearchTerm);

  const currentPage = useSubscribersStore((s) => s.currentPage);
  const setCurrentPage = useSubscribersStore((s) => s.setCurrentPage);

  const openView = useSubscribersStore((s) => s.openView);
  const openEdit = useSubscribersStore((s) => s.openEdit);

  const itemsPerPage = 5;

  const filteredSubscriptions = useMemo(() => {
    const term = searchTerm?.toLowerCase();

    return userSubscriptions.filter(
      (sub) =>
        !term ||
        sub.name.toLowerCase().includes(term) ||
        sub.address.toLowerCase().includes(term) ||
        sub.plan.name.includes(term) ||
        sub.id.toString().includes(term),
    );
  }, [userSubscriptions, searchTerm]);

  const paginatedSubscriptions = filteredSubscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Pagination
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);

  const subscriptionColumns: ColumnDef<UserSubscription>[] = [
    {
      id: "name",
      header: "Subscriber Name",
      cell: ({ row }) => {
        const sub = row.original;

        return (
          <span className="text-sm font-medium text-gray-900">{sub.name}</span>
        );
      },
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => {
        const sub = row.original;
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            {sub.plan.name}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const val = getValue<string>();
        const statusConfig = {
          active: { bg: "bg-green-100", text: "text-green-800" },
          disabled: { bg: "bg-red-100", text: "text-red-800" },
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
          <span>Amount</span>
          <span className="text-gray-400">ⓘ</span>
          <div className="absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 rounded bg-gray-900 px-3 py-2 text-xs whitespace-nowrap text-white group-hover:block">
            Plan Price
          </div>
        </div>
      ),
      cell: ({ row }) => {
        const sub = row.original;
        const num = parseFloat(sub.amount) || 0;
        return (
          <span className="font-semibold text-gray-900">
            ₱{num.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-600">📍 {getValue<string>()}</span>
      ),
    },

    // Actions column (custom)
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const sub = row.original as UserSubscription;

        return (
          <div className="flex items-center justify-end gap-2">
            <button
              aria-label={`View subscriber ${sub.id}`}
              onClick={() => openView(sub)}
              className="rounded p-2 hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </button>

            <button
              aria-label={`Edit subscriber ${sub.id}`}
              onClick={() => openEdit(sub)}
              className="rounded p-2 hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 text-gray-600" />
            </button>

            {/* More Menu (Admin-only fields) */}
            <MoreMenu subscription={sub} />
          </div>
        );
      },
    },
  ];

  return (
    <>
      {/* Search */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, user, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        <DataTable
          type="Subcribers"
          data={paginatedSubscriptions}
          columns={subscriptionColumns}
          showDefaultActions={false}
          getRowId={(row) => row.id}
        />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-lg border bg-white px-4 py-3 shadow-sm">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded border px-3 py-1 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default SubscriptionsTable;
