import type { MonthlyPaymentReportItem } from "@/models/Report";
import {
  useAdminReportingStore,
  type FilterStatus,
} from "@/stores/admin-reporting/useAdminReportingStore";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "../general/DataTable";

const ReportTable = () => {
  const report = useAdminReportingStore((s) => s.report);
  const isGeneratingReport = useAdminReportingStore(
    (s) => s.isGeneratingReport,
  );

  const [sortBy, setSortBy] = useState<string>("name");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  if (!report || report.items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-600">
          No data available for the selected period
        </p>
      </div>
    );
  }

  const filteredItems = report.items.filter(
    (item) =>
      item.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    let compareValue = 0;

    switch (sortBy) {
      case "name":
        compareValue = a.full_name.localeCompare(b.full_name);
        break;
      case "amount":
        compareValue =
          parseFloat(a.billing_amount) - parseFloat(b.billing_amount);
        break;
      case "status":
        compareValue = a.status.localeCompare(b.status);
        break;
      default:
        compareValue = 0;
    }

    return compareValue;
  });

  // Paginate
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedItems = sortedItems.slice(startIdx, startIdx + itemsPerPage);

  const reportItemColumns: ColumnDef<MonthlyPaymentReportItem>[] = [
    {
      accessorKey: "first_name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.full_name}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-600">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "phone_number",
      header: "Phone",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-600">
          {getValue<string>() || "-"}
        </span>
      ),
    },
    {
      accessorKey: "billing_amount",
      header: "Billing Amount",
      cell: ({ getValue }) => (
        <span className="block text-right font-bold">
          ₱
          {parseFloat(getValue<string>()).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      accessorKey: "total_paid",
      header: "Paid Amount",
      cell: ({ getValue }) => (
        <span className="block text-right font-semibold text-green-600">
          ₱
          {parseFloat(getValue<string>()).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const val = getValue<string>() as Exclude<FilterStatus, "all">;

        const statusColors = {
          Paid: "bg-green-100 text-green-700",
          Unpaid: "bg-red-100 text-red-700",
        };

        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[val]}`}
          >
            {val}
          </span>
        );
      },
    },
    {
      accessorKey: "payment_method",
      header: "Payment Method",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-600">
          {getValue<string>() || "-"}
        </span>
      ),
    },
  ];

  if (isGeneratingReport) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <div className="inline-block">
          <i className="fa-solid fa-spinner fa-spin text-2xl text-indigo-600"></i>
          <p className="mt-2 text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Controls */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-indigo-600"
            >
              <option value="name">Sort by Name</option>
              <option value="amount">Sort by Amount</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-lg">
        <DataTable
          data={paginatedItems}
          columns={reportItemColumns}
          showDefaultActions={false}
          // getRowId={(row) => row.id} // or row.id if you have a unique billing id
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-700">
              Showing <span className="font-semibold">{startIdx + 1}</span> to{" "}
              <span className="font-semibold">
                {Math.min(startIdx + itemsPerPage, sortedItems.length)}
              </span>{" "}
              of <span className="font-semibold">{sortedItems.length}</span>{" "}
              results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center px-3 text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTable;
