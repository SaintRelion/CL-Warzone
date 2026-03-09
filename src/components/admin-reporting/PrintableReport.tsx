import { useAdminReportingStore } from "@/stores/admin-reporting/useAdminReportingStore";

const PrintableReport = () => {
  const report = useAdminReportingStore((s) => s.report);
  if (!report) return <p className="text-gray-500">No report available.</p>;

  return (
    <div
      className="print:bg-white print:p-6 print:text-black"
      id="printable-report"
    >
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Monthly Payment Report</h1>
        <p className="text-sm">
          {report.month + 1}/{report.year}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-sm print:text-black">
          <thead>
            <tr className="bg-gray-200 text-gray-800 print:bg-gray-300">
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Phone</th>
              <th className="border px-2 py-1">Billing Amount</th>
              <th className="border px-2 py-1">Paid Amount</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {report.items.map((item, i) => (
              <tr key={i} className="even:bg-gray-100 print:even:bg-white">
                <td className="border px-2 py-1">{item.full_name}</td>
                <td className="border px-2 py-1">{item.email}</td>
                <td className="border px-2 py-1">{item.phone_number || "-"}</td>
                <td className="border px-2 py-1">{item.billing_amount}</td>
                <td className="border px-2 py-1">{item.total_paid}</td>
                <td className="border px-2 py-1">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer for totals / notes */}
      <div className="mt-6 text-right text-sm print:text-black">
        <p>Total Records: {report.items.length}</p>
      </div>

      {/* Print Button */}
      <div className="mt-4 flex justify-end print:hidden">
        <button
          onClick={() => {
            window.print();
          }}
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Print Report
        </button>
      </div>
    </div>
  );
};

export default PrintableReport;
