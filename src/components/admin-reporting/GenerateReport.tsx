import { toast } from "@saintrelion/notifications";
import { Button } from "../ui/button";
import { useAdminReportingStore } from "@/stores/admin-reporting/useAdminReportingStore";
import { BASE_API } from "@/sr-config";
import { apiRequest } from "@/pages/to-be-library/sr-api";

const GenerateReport = () => {
  const viewReport = useAdminReportingStore((s) => s.viewReport);
  const dateToReport = useAdminReportingStore((s) => s.dateToReport);
  const isGeneratingReport = useAdminReportingStore(
    (s) => s.isGeneratingReport,
  );
  const setGeneratingReport = useAdminReportingStore(
    (s) => s.setGeneratingReport,
  );
  const statusFilter = useAdminReportingStore((s) => s.statusFilter);

  const generateReport = async () => {
    if (!dateToReport.length) {
      toast.error("Please select a month and year");
      return;
    }

    setGeneratingReport(true);

    const [month, year] = dateToReport;

    try {
      const result = await apiRequest(
        `${BASE_API}api/monthlypaymentreport/?month=${month}&year=${year}&status=${statusFilter}`,
        null,
        { method: "GET" },
      );

      console.log(result);

      if (!result || !result.items?.length) {
        toast.error("No data available for the selected period");
        setGeneratingReport(false);
        return;
      }

      viewReport(result);
      toast.success("Report generated successfully");
    } catch (err) {
      const error = err as Record<string, string>;
      toast.error(`Failed to generate report: ${error}`);
    } finally {
      setGeneratingReport(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Action</label>
      <Button
        onClick={generateReport}
        className="h-18 w-full bg-linear-to-r from-indigo-600 to-purple-600 text-base font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl disabled:opacity-50"
      >
        {isGeneratingReport ? (
          <div className="flex flex-col items-center gap-1">
            <i className="fa-solid fa-spinner fa-spin text-xl" />
            <span className="text-xs">Generating...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <i className="fa-solid fa-chart-line text-xl" />
            <span>Generate Report</span>
          </div>
        )}
      </Button>
    </div>
  );
};
export default GenerateReport;
