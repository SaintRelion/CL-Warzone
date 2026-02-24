import { useActivityLogger } from "@/lib/activity-logger";
import type {
  MonthlyPaymentReport,
  MonthlyPaymentReportItem,
} from "@/models/Report";
import { toast } from "@saintrelion/notifications";
import { Button } from "../ui/button";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import type { UserBillingInfo } from "@/models/Billing";
import type { PaymentHistory } from "@/models/PaymentHistory";
import { useAdminReportingStore } from "@/stores/admin-reporting/useAdminReportingStore";
import type { User } from "@/models/user";
import { PLANS } from "@/constants";
import { toDate } from "@saintrelion/time-functions";

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

const GenerateReport = () => {
  const { log } = useActivityLogger();

  const viewReport = useAdminReportingStore((s) => s.viewReport);

  const dateToReport = useAdminReportingStore((s) => s.dateToReport);

  const isGeneratingReport = useAdminReportingStore(
    (s) => s.isGeneratingReport,
  );
  const setGeneratingReport = useAdminReportingStore(
    (s) => s.setGeneratingReport,
  );

  const statusFilter = useAdminReportingStore((s) => s.statusFilter);

  const { useList: getUsers } = useResourceLocked<User>("user");
  const { useList: getUserBilling } =
    useResourceLocked<UserBillingInfo>("userbilling");
  const { useList: getPaymentHistory } =
    useResourceLocked<PaymentHistory>("paymenthistory");

  const users = getUsers().data;
  const userBillings = getUserBilling().data;
  const paymentHistory = getPaymentHistory().data;

  function buildReport(): MonthlyPaymentReport | null {
    if (
      users.length == 0 ||
      userBillings.length === 0 ||
      dateToReport.length == 0
    ) {
      return null;
    }

    const month = dateToReport[0];
    const year = dateToReport[1];

    const { startDate, endDate } = getMonthRange(month, year);
    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();

    // Pre-filter payments
    const billsForThisMonth = userBillings.filter((b) => {
      const date = toDate(b.created_at);

      if (!date) return false;

      const t = date.getTime();
      return t >= startTime && t <= endTime;
    });

    // Create a user map for faster lookup
    const userMap = new Map(users.map((u) => [u.id, u]));

    // Build report items
    const filteredBillings =
      statusFilter === "all"
        ? billsForThisMonth
        : billsForThisMonth.filter((b) => b.status === statusFilter);

    const items: MonthlyPaymentReportItem[] = filteredBillings.map(
      (billing) => {
        const user = userMap.get(billing.user);

        const billingAmount = parseFloat(billing.amount);
        const totalPaid = billing.total_paid;

        const assumeOnly1Payment = paymentHistory.filter(
          (p) => p.bill == billing.id,
        )[0];
        return {
          user: billing.user,
          full_name: billing.customer,
          email: !user ? "N/A" : user.email,
          phone_number: !user ? "" : user.phone_number,
          billing_amount: billingAmount.toString(),
          total_paid: totalPaid.toString(),
          total_change_given_back: billing.total_change_given_back,
          total_credits: billing.total_credits,
          status: billing.status,
          plan: !PLANS[parseInt(billing.plan)]
            ? billing.plan
            : PLANS[parseInt(billing.plan)].name,
          payment_date: !assumeOnly1Payment
            ? ""
            : assumeOnly1Payment.created_at,
          payment_method: !assumeOnly1Payment ? "" : assumeOnly1Payment.method,
          transaction_ref: !assumeOnly1Payment
            ? ""
            : assumeOnly1Payment.transaction_ref,
        };
      },
    );

    // Summaries
    const totalBillable = filteredBillings.reduce(
      (sum, i) => sum + parseFloat(i.amount),
      0,
    );

    const totalRevenue = filteredBillings
      .filter((b) => b.status == "Paid")
      .reduce((sum, i) => sum + parseFloat(i.amount), 0);

    const totalUnpaid = filteredBillings
      .filter((b) => b.status != "Paid")
      .reduce((sum, i) => sum + parseFloat(i.amount), 0);

    const summary = items.reduce(
      (acc, i) => {
        acc.total_subscribers += 1;
        if (i.status === "Paid") acc.paid_subscribers += 1;
        if (i.status === "Unpaid") acc.unpaid_subscribers += 1;

        acc.total_collected += Number(i.total_paid);
        acc.total_change_given_back += i.total_change_given_back;
        acc.total_credits += i.total_credits;
        return acc;
      },
      {
        total_subscribers: 0,
        paid_subscribers: 0,
        unpaid_subscribers: 0,
        collection_rate: 0,
        total_collected: 0,
        total_change_given_back: 0,
        total_credits: 0,
        net_revenue: 0,
      },
    );

    summary.collection_rate =
      totalBillable > 0 ? Math.round((totalRevenue / totalBillable) * 100) : 0;
    summary.net_revenue =
      summary.total_collected -
      summary.total_change_given_back -
      summary.total_credits;

    return {
      month,
      year,
      generated_at: new Date().toISOString(),
      total_billable: parseFloat(totalBillable.toFixed(2)),
      total_revenue: parseFloat(totalRevenue.toFixed(2)),
      total_unpaid: parseFloat(totalUnpaid.toFixed(2)),
      items,
      summary,
    };
  }

  function generateReport() {
    setGeneratingReport(true);
    const newReport = buildReport();

    if (newReport == null || newReport.items.length === 0) {
      toast.error("No data available for the selected period");

      setGeneratingReport(false);
      return;
    }

    toast.success("Report generated successfully");
    viewReport(newReport);

    // Log activity
    log({
      action: "create",
      category: "reports",
      description: `Generated monthly payment report for ${newReport.month + 1}/${newReport.year}`,
      additional_info: {
        reportType: "monthly-payment-report",
        month: String(newReport.month),
        year: String(newReport.year),
      },
    });

    setGeneratingReport(false);
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Action</label>
      <Button
        onClick={() => generateReport()}
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
