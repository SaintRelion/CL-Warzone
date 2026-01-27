import { useState, useCallback, useMemo } from "react";
import { toast } from "@saintrelion/notifications";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import type { MonthlyPaymentReport, MonthlyPaymentReportItem } from "@/models/Report";
import type { BillingInfo } from "@/models/Billing";
import type { PaymentHistory } from "@/models/PaymentHistory";
import type { User } from "@/models/user";
import ReportControls from "@/components/admin/ReportControls";
import ReportSummary from "@/components/admin/ReportSummary";
import ReportTable from "@/components/admin/ReportTable";
import { useActivityLogger } from "@/lib/activity-logger";

const AdminReportingPage = () => {
  const { log } = useActivityLogger();

  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch actual data from resources
  const { useList: getUsers } = useResourceLocked<User>("user");
  const { useList: getBillings } = useResourceLocked<BillingInfo>("billing");
  const { useList: getPaymentHistory } =
    useResourceLocked<PaymentHistory>("paymenthistory");

  const usersData = getUsers().data || [];
  const billingsData = getBillings().data || [];
  const paymentsData = getPaymentHistory().data || [];
  
  const isLoading = usersData.length === 0 || billingsData.length === 0 || paymentsData.length === 0;

  // Helper to get month/year range
  const getMonthRange = (monthNum: number, yearNum: number) => {
    const startDate = new Date(yearNum, monthNum, 1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(yearNum, monthNum + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  };

  // Calculate report from actual data
  const report = useMemo(() => {
    // Log data availability
    console.log("Report calculation - Data status:", {
      users: usersData.length,
      billings: billingsData.length,
      payments: paymentsData.length
    });

    // If no billing data, return empty report
    if (billingsData.length === 0) {
      console.log("No billing data found");
      
      return {
        month,
        year,
        generatedAt: new Date().toISOString(),
        totalBillable: 0,
        totalCollected: 0,
        totalPending: 0,
        items: [],
        summary: {
          totalSubscribers: 0,
          paidSubscribers: 0,
          partiallyPaidSubscribers: 0,
          unpaidSubscribers: 0,
          collectionRate: 0,
        },
      };
    }

    const { startDate, endDate } = getMonthRange(month, year);
    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();

    console.log("Generating report for:", { month: month + 1, year, startDate, endDate });
    console.log("Total users with email:", usersData.filter(u => u.emailAddress).length);
    console.log("Total billings:", billingsData.length);
    console.log("Sample billing:", billingsData[0]);
    console.log("Sample user:", usersData[0]);

    // Filter payments for this month
    const monthlyPayments = paymentsData.filter((p) => {
      try {
        const paymentDate = new Date(p.createdAt).getTime();
        return paymentDate >= startTime && paymentDate <= endTime;
      } catch (e) {
        return false;
      }
    });

    console.log("Monthly payments found:", monthlyPayments.length);
    console.log("Users without email:", usersData.filter(u => !u.emailAddress).length);
    console.log("Total billings:", billingsData.length);

    // Build report items directly from billing data
    const items: MonthlyPaymentReportItem[] = billingsData
      .map((billing) => {
        // Find the user for this billing
        const user = usersData.find((u) => u.id === billing.userId);
        
        // Get payments for this billing/user in this month
        const userPayments = monthlyPayments.filter((p) => p.userId === billing.userId);

        const billingAmount = parseFloat(billing.amount as any) || 0;
        const paidAmount = userPayments
          .filter((p) => p.status === "Paid")
          .reduce((sum, p) => sum + parseFloat(p.amount || "0"), 0);

        // Use billing status directly
        const paymentStatus = (billing.status || "Not Yet Paid") as "Paid" | "Partially Paid" | "Not Yet Paid";

        // Filter by status if requested
        if (statusFilter !== "all" && statusFilter !== paymentStatus) {
          return null;
        }

        const reportItem: MonthlyPaymentReportItem = {
          userId: user?.id || billing.userId,
          firstName: user?.firstName || "N/A",
          lastName: user?.lastName || "",
          emailAddress: user?.emailAddress || "N/A",
          phoneNumber: (user as User)?.phoneNumber || "",
          billingAmount: billingAmount.toFixed(2),
          paidAmount: paidAmount.toFixed(2),
          status: paymentStatus,
          planId: billing.planId || "",
          paymentDate:
            userPayments.length > 0 ? userPayments[0].createdAt : "",
          paymentMethod: userPayments.length > 0 ? userPayments[0].method : "",
          transactionRef:
            userPayments.length > 0 ? userPayments[0].transactionRef : "",
        };
        return reportItem;
      })
      .filter((item): item is MonthlyPaymentReportItem => item !== null);

    console.log("Report items generated:", items.length);
    console.log("Sample report item:", items[0]);
    console.log("Status filter:", statusFilter);

    // Calculate summary
    const totalBillable = items.reduce(
      (sum, item) => sum + parseFloat(item.billingAmount),
      0
    );
    const totalCollected = items.reduce(
      (sum, item) => sum + parseFloat(item.paidAmount),
      0
    );
    const totalPending = totalBillable - totalCollected;

    const paidCount = items.filter((item) => item.status === "Paid").length;
    const partiallyPaidCount = items.filter(
      (item) => item.status === "Partially Paid"
    ).length;
    const unpaidCount = items.filter(
      (item) => item.status === "Not Yet Paid"
    ).length;

    const collectionRate =
      totalBillable > 0
        ? Math.round((totalCollected / totalBillable) * 100)
        : 0;

    const report: MonthlyPaymentReport = {
      month,
      year,
      generatedAt: new Date().toISOString(),
      totalBillable: parseFloat(totalBillable.toFixed(2)),
      totalCollected: parseFloat(totalCollected.toFixed(2)),
      totalPending: parseFloat(totalPending.toFixed(2)),
      items,
      summary: {
        totalSubscribers: items.length,
        paidSubscribers: paidCount,
        partiallyPaidSubscribers: partiallyPaidCount,
        unpaidSubscribers: unpaidCount,
        collectionRate,
      },
    };

    console.log("Final report:", {
      month: report.month,
      year: report.year,
      itemsCount: report.items.length,
      totalBillable: report.totalBillable,
      totalCollected: report.totalCollected,
      totalPending: report.totalPending,
    });

    return report;
  }, [month, year, statusFilter, usersData, billingsData, paymentsData]);

  const generateReport = useCallback(() => {
    if (!report) {
      toast.error("No data available for the selected period");
      return;
    }

    toast.success("Report generated successfully");

    // Log activity
    log({
      action: "REPORT_GENERATED",
      category: "reports",
      description: `Generated monthly payment report for ${month + 1}/${year}`,
      additionalInfo: {
        reportType: "monthly-payment-report",
        month: String(month),
        year: String(year),
      },
    });
  }, [report, month, year, log]);

  const exportCSV = useCallback(async () => {
    if (!report) {
      toast.error("Generate a report first before exporting");
      return;
    }

    try {
      // Build CSV content
      let csvContent =
        "Name,Email,Phone,Billing Amount,Paid Amount,Status,Payment Method,Transaction Ref\n";

      report.items.forEach((item) => {
        const fullName = `${item.firstName} ${item.lastName}`;
        csvContent += `"${fullName}","${item.emailAddress}","${item.phoneNumber || ""}","${item.billingAmount}","${item.paidAmount}","${item.status}","${item.paymentMethod || ""}","${item.transactionRef || ""}"\n`;
      });

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payment-report-${year}-${String(month + 1).padStart(
        2,
        "0"
      )}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Report exported successfully");

      // Log activity
      log({
        action: "REPORT_EXPORTED",
        category: "reports",
        description: `Exported monthly payment report for ${month + 1}/${year} as CSV`,
        additionalInfo: {
          reportType: "monthly-payment-report",
          month: String(month),
          year: String(year),
          format: "csv",
        },
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to export report";
      toast.error(errorMsg);
    }
  }, [report, month, year, log]);

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
      <ReportControls
        month={month}
        year={year}
        status={statusFilter}
        onMonthChange={setMonth}
        onYearChange={setYear}
        onStatusChange={setStatusFilter}
        onGenerateReport={generateReport}
        onExportCSV={exportCSV}
        isLoading={isLoading}
      />

      {/* Report Summary */}
      <ReportSummary report={report} />

      {/* Report Table */}
      <ReportTable items={report.items} isLoading={isLoading} />
    </div>
  );
};

export default AdminReportingPage;
