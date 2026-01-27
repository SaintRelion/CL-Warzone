import { useState } from "react";
import type { MonthlyPaymentReportItem } from "@/models/Report";

const Table = ({ children }: { children: React.ReactNode }) => (
  <table className="w-full">{children}</table>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead>{children}</thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody>{children}</tbody>
);

const TableRow = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <tr className={className}>{children}</tr>
);

const TableHead = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <th className={className}>{children}</th>
);

const TableCell = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={className}>{children}</td>
);

interface ReportTableProps {
  items: MonthlyPaymentReportItem[];
  isLoading: boolean;
}

const getStatusBadgeColor = (
  status: "Paid" | "Partially Paid" | "Not Yet Paid"
) => {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-800";
    case "Partially Paid":
      return "bg-yellow-100 text-yellow-800";
    case "Not Yet Paid":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ReportTable = ({ items, isLoading }: ReportTableProps) => {
  const [sortBy, setSortBy] = useState<string>("name");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Filter items based on search
  const filteredItems = items.filter(
    (item) =>
      item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.emailAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    let compareValue = 0;

    switch (sortBy) {
      case "name":
        compareValue = `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        );
        break;
      case "amount":
        compareValue =
          parseFloat(a.billingAmount) - parseFloat(b.billingAmount);
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
  const paginatedItems = sortedItems.slice(
    startIdx,
    startIdx + itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <div className="inline-block">
          <i className="fa-solid fa-spinner fa-spin text-2xl text-indigo-600"></i>
          <p className="mt-2 text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-600">No data available for the selected period</p>
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
      <div className="overflow-x-auto">
        {paginatedItems.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50">
              <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Name</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Email</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Phone</TableHead>
              <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">
                Billing Amount
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">
                Paid Amount
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Status</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Payment Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((item, idx) => (
              <TableRow key={idx} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                <TableCell className="px-4 py-4 font-medium text-gray-900">
                  {item.firstName} {item.lastName}
                </TableCell>
                <TableCell className="px-4 py-4 text-sm text-gray-600">
                  {item.emailAddress}
                </TableCell>
                <TableCell className="px-4 py-4 text-sm text-gray-600">
                  {item.phoneNumber || "-"}
                </TableCell>
                <TableCell className="px-4 py-4 text-right font-semibold text-gray-900">
                  ₱{parseFloat(item.billingAmount).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </TableCell>
                <TableCell className="px-4 py-4 text-right font-semibold text-green-600">
                  ₱{parseFloat(item.paidAmount).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </TableCell>
                <TableCell className="px-4 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-4 text-sm text-gray-600">
                  {item.paymentMethod || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-700">
              Showing <span className="font-semibold">{startIdx + 1}</span> to{" "}
              <span className="font-semibold">{Math.min(startIdx + itemsPerPage, sortedItems.length)}</span> of{" "}
              <span className="font-semibold">{sortedItems.length}</span> results
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
