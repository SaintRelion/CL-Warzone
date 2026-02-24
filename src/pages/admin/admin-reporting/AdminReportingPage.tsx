import ReportControls from "@/components/admin-reporting/ReportControls";
import ReportSummary from "@/components/admin-reporting/ReportSummary";
import ReportTable from "@/components/admin-reporting/ReportTable";

const AdminReportingPage = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Payment Reports</h1>
        <p className="mt-2 text-gray-600">
          Generate and analyze monthly payment reports for your subscribers
        </p>
      </div>

      {/* Report Controls */}
      <ReportControls />

      {/* Report Summary */}
      <ReportSummary />

      {/* Report Table */}
      <ReportTable />
    </div>
  );
};

export default AdminReportingPage;
