import { useState } from "react";
import { useAdminReportingStore } from "@/stores/admin-reporting/useAdminReportingStore";

const PrintableReport = () => {
  const report = useAdminReportingStore((s) => s.report);

  // State for replaceable names
  const [preparedBy, setPreparedBy] = useState("Staff Name");
  const [preparedRole, setPreparedRole] = useState("Cashier");
  const [approvedBy, setApprovedBy] = useState("Manager Name");
  const [approvedRole, setApprovedRole] = useState("Owner");

  if (!report) return <p className="text-gray-500">No report available.</p>;

  const totalCollection = report.items
    .filter((item) => item.status === "paid")
    .reduce((sum, item) => sum + Number(item.billing_amount || 0), 0);

  return (
    <div
      className="mx-auto mb-10 flex min-h-[1056px] max-w-4xl flex-col bg-white p-8 shadow-md print:m-0 print:min-h-screen print:w-full print:bg-white print:p-12 print:shadow-none"
      id="printable-report"
    >
      {/* 1. Main Content Wrapper (Grows to push footer down) */}
      <div className="print:grow">
        {/* Header Section */}
        <div className="mb-8 flex flex-col items-center border-b-2 border-indigo-900 pb-4">
          <img
            src="/my-logo.png"
            alt="Warzone Logo"
            className="mb-2 h-16 w-auto object-contain"
          />
          <div className="text-center">
            <div className="text-2xl font-black tracking-tighter text-indigo-900">
              WARZONE
            </div>
            <div className="text-xs font-bold tracking-widest text-gray-700 uppercase">
              Internet Services Provider
            </div>
            <div className="mt-1 text-xs text-gray-500">
              San Antonio, Looy, Katipunan, Zamboanga del Norte
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold uppercase underline">
              Monthly Payment Report
            </h2>
            <p className="text-sm font-medium text-gray-600">
              Period: {report.month + 1}/{report.year}
            </p>
          </div>
          <div className="text-right text-xs text-gray-400">
            Generated on: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm print:text-black">
            <thead>
              <tr className="bg-gray-100 text-gray-800 print:bg-gray-200">
                <th className="border border-gray-300 px-2 py-2 text-left">
                  Name
                </th>
                <th className="border border-gray-300 px-2 py-2 text-left">
                  Email
                </th>
                <th className="border border-gray-300 px-2 py-2 text-left">
                  Phone
                </th>
                <th className="border border-gray-300 px-2 py-2 text-right">
                  Billing
                </th>
                <th className="border border-gray-300 px-2 py-2 text-right">
                  Paid
                </th>
                <th className="border border-gray-300 px-2 py-2 text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {report.items.map((item, i) => (
                <tr key={i} className="even:bg-gray-50 print:even:bg-white">
                  <td className="border border-gray-300 px-2 py-1 font-medium">
                    {item.full_name}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-xs">
                    {item.email}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {item.phone_number || "-"}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-right">
                    {item.billing_amount}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-right">
                    {item.total_paid}
                  </td>
                  <td
                    className={`border border-gray-300 px-2 py-1 text-center text-[10px] font-bold uppercase ${item.status === "paid" ? "text-green-600" : "text-red-600"}`}
                  >
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Info */}
        <div className="mt-4 flex items-start justify-between text-xs italic">
          <p>* Cut off for Overdue bills is on the 5th day of the month.</p>
          <div className="text-right">
            <p className="text-lg font-bold not-italic">
              Total Collection: PHP {totalCollection.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Signatories Section */}
      <div className="mt-12 mb-8 grid grid-cols-2 gap-24">
        {/* Prepared By Column */}
        <div className="flex flex-col text-left">
          <p className="mb-4 text-sm font-semibold uppercase">Prepared by:</p>
          <input
            type="text"
            value={preparedBy}
            onChange={(e) => setPreparedBy(e.target.value)}
            className="w-full border-b border-black text-center font-bold focus:outline-none print:border-b"
          />
          <input
            type="text"
            value={preparedRole}
            onChange={(e) => setPreparedRole(e.target.value)}
            className="w-full text-center text-sm text-gray-600 italic focus:outline-none"
          />
        </div>

        {/* Approved By Column */}
        <div className="flex flex-col text-left">
          <p className="mb-4 text-sm font-semibold uppercase">Approved by:</p>
          <input
            type="text"
            value={approvedBy}
            onChange={(e) => setApprovedBy(e.target.value)}
            className="w-full border-b border-black text-center font-bold focus:outline-none print:border-b"
          />
          <input
            type="text"
            value={approvedRole}
            onChange={(e) => setApprovedRole(e.target.value)}
            className="w-full text-center text-sm text-gray-600 italic focus:outline-none"
          />
        </div>
      </div>

      {/* Print Tool Section (Hidden during print) */}
      <div className="mt-10 flex items-center justify-end gap-4 border-t pt-4 print:hidden">
        <div className="text-xs text-gray-400 italic">
          Tip: You can edit the names above before printing.
        </div>
        <button
          onClick={() => window.print()}
          className="rounded bg-indigo-600 px-6 py-2 font-bold text-white transition-colors hover:bg-indigo-700"
        >
          Print Official Report
        </button>
      </div>
    </div>
  );
};

export default PrintableReport;
