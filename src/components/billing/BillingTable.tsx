import type { UserBillingInfo } from "@/models/Billing";
import type { PaymentHistory } from "@/models/PaymentHistory";
import { formatReadableDate, toDate } from "@saintrelion/time-functions";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../general/DataTable";
import { CircleCheck, CircleXIcon, Search } from "lucide-react";
import BillingActions from "./BillingActions";
import {
  useBillingStore,
  type BillingFilter,
  type BillingSort,
} from "@/stores/billing/useBillingStore";
import { useMemo } from "react";

const BillingTable = ({
  userBillings,
  paymentHistories,
  currentMonth,
  currentYear,
}: {
  userBillings: UserBillingInfo[];
  paymentHistories: PaymentHistory[];
  currentMonth: number;
  currentYear: number;
}) => {
  const searchTerm = useBillingStore((s) => s.searchTerm);
  const setSearchTerm = useBillingStore((s) => s.setSearchTerm);

  const billingFilter = useBillingStore((s) => s.billingFilter);
  const setBillingFilter = useBillingStore((s) => s.setBillingFilter);

  const billingSort = useBillingStore((s) => s.billingSort);
  const setBillingSort = useBillingStore((s) => s.setBillingSort);

  const billingSortOrder = useBillingStore((s) => s.billingSortOrder);
  const setBillingSortOrder = useBillingStore((s) => s.setBillingSortOrder);

  const currentPage = useBillingStore((s) => s.currentPage);
  const setCurrentPage = useBillingStore((s) => s.setCurrentPage);

  const itemsPerPage = 5;

  const filteredBillings = useMemo(() => {
    const term = searchTerm?.toLowerCase();

    return userBillings.filter((b) => {
      const matchesSearch =
        !term ||
        b.customer.toLowerCase().includes(term) ||
        b.user.toString().includes(term);

      const toDateBill = toDate(b.created_at);

      const matchesFilter =
        billingFilter === "paid"
          ? b.status === "paid"
          : billingFilter === "unpaid"
            ? b.status === "unpaid"
            : billingFilter === "this-month"
              ? toDateBill?.getMonth() === currentMonth &&
                toDateBill.getFullYear() === currentYear
              : true;

      return matchesSearch && matchesFilter;
    });
  }, [userBillings, searchTerm, billingFilter, currentMonth, currentYear]);

  const sortedBillings = useMemo(() => {
    const compareFns: Record<
      string,
      (a: UserBillingInfo, b: UserBillingInfo) => number
    > = {
      date: (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      amount: (a, b) => Number(a.amount) - Number(b.amount),
      customer: (a, b) => a.customer.localeCompare(b.customer),
    };

    const cmp = compareFns[billingSort] ?? (() => 0);
    return [...filteredBillings].sort((a, b) =>
      billingSortOrder === "asc" ? cmp(a, b) : -cmp(a, b),
    );
  }, [filteredBillings, billingSort, billingSortOrder]);

  const paginatedBillings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedBillings.slice(start, start + itemsPerPage);
  }, [sortedBillings, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedBillings.length / itemsPerPage);

  const billingColumns: ColumnDef<UserBillingInfo>[] = [
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ getValue }) => (
        <span className="font-semibold">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ getValue }) => (
        <span className="font-bold">₱{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Billed At",
      cell: ({ getValue }) => (
        <span className="font-semibold text-indigo-600">
          {formatReadableDate(getValue<string>())}
        </span>
      ),
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ getValue }) => (
        <span className="font-semibold text-indigo-600">
          {formatReadableDate(getValue<string>())}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const val = getValue<string>();
        const paid = val === "paid";

        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold shadow-sm transition-colors duration-150 ${
              paid
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {paid ? (
              <CircleCheck className="mr-1 h-4 w-4" />
            ) : (
              <CircleXIcon className="mr-1 h-4 w-4" />
            )}
            {val}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const bill = row.original;

        const paymentHistory = paymentHistories.find(
          (h) => h.bill === bill.id && h.status === "completed",
        );

        return <BillingActions bill={bill} paymentHistory={paymentHistory} />;
      },
    },
  ];

  return (
    <>
      {/* FILTERS AND SEARCH - MINIMALIST */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        {/* Search */}
        <div className="relative min-w-62.5 flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customer, method, ID..."
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 pl-9 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <select
          value={billingFilter}
          onChange={(e) => setBillingFilter(e.target.value as BillingFilter)}
          className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
          title="Filter by status"
        >
          <option value="all">📋 All</option>
          <option value="paid">✓ Paid</option>
          <option value="unpaid">⏳ Unpaid</option>
          <option value="this-month">📅 This Month</option>
        </select>

        {/* Sort By */}
        <select
          value={billingSort}
          onChange={(e) => setBillingSort(e.target.value as BillingSort)}
          className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
          title="Sort by"
        >
          <option value="date">📅 Date</option>
          <option value="amount">💰 Amount</option>
          <option value="customer">👤 Customer</option>
        </select>

        {/* Sort Order Toggle */}
        <button
          onClick={() =>
            setBillingSortOrder(billingSortOrder === "desc" ? "asc" : "desc")
          }
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          title={`Sort ${billingSortOrder === "desc" ? "ascending" : "descending"}`}
        >
          {billingSortOrder === "desc" ? "↓" : "↑"}
        </button>

        {/* Results Count */}
        <div className="ml-auto text-xs whitespace-nowrap text-gray-600">
          {paginatedBillings.length} / {sortedBillings.length}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-lg">
        <DataTable
          data={paginatedBillings}
          columns={billingColumns}
          showDefaultActions={false}
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
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded border px-3 py-1 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded px-3 py-1 text-sm font-medium ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
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
export default BillingTable;
