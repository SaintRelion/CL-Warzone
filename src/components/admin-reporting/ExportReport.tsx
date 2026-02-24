import { useActivityLogger } from "@/lib/activity-logger";
import { Button } from "../ui/button";
import { useAdminReportingStore } from "@/stores/admin-reporting/useAdminReportingStore";
import { toast } from "@saintrelion/notifications";

const ExportReport = () => {
  const { log } = useActivityLogger();

  const report = useAdminReportingStore((s) => s.report);

  function exportCSV() {
    try {
      if (!report) return;

      // Build CSV content
      let csvContent =
        "Name,Email,Phone,Billing Amount,Paid Amount,Status,Payment Method,Transaction Ref\n";

      report.items.forEach((item) => {
        csvContent += `"${item.full_name}","${item.email}","${item.phone_number || ""}","${item.billing_amount}","${item.total_paid}","${item.status}","${item.payment_method || ""}","${item.transaction_ref || ""}"\n`;
      });

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payment-report-${report.year}-${String(
        report.month + 1,
      ).padStart(2, "0")}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Report exported successfully");

      // Log activity
      log({
        action: "create",
        category: "reports",
        description: `Exported monthly payment report for ${report.month + 1}/${report.year} as CSV`,
        additional_info: {
          reportType: "monthly-payment-report",
          month: String(report.month),
          year: String(report.year),
          format: "csv",
        },
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to export report";
      toast.error(errorMsg);
    }
  }

  return (
    <div className="mt-6 flex items-center justify-between rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <i className="fa-solid fa-file-excel text-green-600"></i>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Export Report</p>
          <p className="text-xs text-gray-600">Download as CSV file</p>
        </div>
      </div>
      <Button
        onClick={() => {
          exportCSV();
        }}
        disabled={!report}
        variant="outline"
        className="border-2 border-green-600 font-medium text-green-700 transition-all hover:bg-green-50"
      >
        <i className="fa-solid fa-download mr-2" />
        Export CSV
      </Button>
    </div>
  );
};
export default ExportReport;
