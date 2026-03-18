import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../general/DataTable";
import { Search } from "lucide-react";

import { useMemo } from "react";
import type { User } from "@/models/user";
import MoreMenu from "./MoreMenu";
import { useAccountsStore } from "@/stores/accounts/useAccountsStore";

const AccountsTable = ({
  users,
  currentPage,
  totalPages,
}: {
  users: User[];
  currentPage: number;
  totalPages: number;
}) => {
  const searchTerm = useAccountsStore((a) => a.searchTerm);
  const setSearchTerm = useAccountsStore((a) => a.setSearchTerm);

  const setCurrentPage = useAccountsStore((a) => a.setCurrentPage);

  const filteredUsers = useMemo(() => {
    const term = searchTerm?.toLowerCase();

    return users.filter(
      (user) =>
        !term ||
        user.first_name.toLowerCase().includes(term) ||
        user.last_name.toLowerCase().includes(term) ||
        user.email.toString().includes(term) ||
        user.phone_number.includes(term) ||
        user.street_address.includes(term) ||
        user.city_municipality.includes(term),
    );
  }, [users, searchTerm]);

  const userColumns: ColumnDef<User>[] = [
    {
      id: "name",
      header: "Full Name",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <span className="text-sm font-medium text-gray-900">
            {user.first_name} {user.last_name}
          </span>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            {user.email}
          </span>
        );
      },
    },
    {
      accessorKey: "phone_number",
      header: "Phone Number",
      cell: ({ getValue }) => {
        const val = getValue<string>();

        return (
          <span
            className={`inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800`}
          >
            {val}
          </span>
        );
      },
    },
    {
      accessorKey: "street_address",
      header: "Street Address",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <span className="font-semibold text-gray-900">
            {user.street_address}
          </span>
        );
      },
    },
    {
      accessorKey: "city_municipality",
      header: "City",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-600">📍 {getValue<string>()}</span>
      ),
    },

    {
      accessorKey: "barangay",
      header: "Barangay",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-600">📍 {getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "service_area",
      header: "Service Area",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-600">📍 {getValue<string>()}</span>
      ),
    },

    // Actions column (custom)
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const user = row.original as User;

        return (
          <div className="flex items-center justify-end gap-2">
            {/* More Menu (Admin-only fields) */}
            <MoreMenu user={user} />
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
          type="Accounts"
          data={filteredUsers}
          columns={userColumns}
          showDefaultActions={false}
          getRowId={(row) => row.id}
          getRowClassName={(user) => {
            switch (user.status) {
              case "active":
                return "bg-green-100";
              case "disabled":
                return "bg-yellow-100";
              case "deactivated":
                return "bg-red-100";
              default:
                return "";
            }
          }}
        />
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-3 border border-t bg-white px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6 md:py-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex flex-wrap gap-2">
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
export default AccountsTable;
