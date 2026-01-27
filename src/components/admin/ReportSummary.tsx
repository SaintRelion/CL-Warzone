import type { MonthlyPaymentReport } from "@/models/Report";
import type { User } from "@/models/user";
import type { BillingInfo } from "@/models/Billing";
import type { PaymentHistory } from "@/models/PaymentHistory";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { useMemo } from "react";

interface ReportSummaryProps {
  report: MonthlyPaymentReport | null;
}

const StatCard = ({
  title,
  value,
  subtext,
  bgColor,
  icon,
}: {
  title: string;
  value: string | number;
  subtext?: string;
  bgColor: string;
  icon?: string;
}) => (
  <div
    className={`rounded-xl border border-gray-200 p-5 shadow-sm transition-all hover:shadow-md ${bgColor}`}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">{title}</p>
        <p className="mt-3 text-3xl font-extrabold text-gray-900">{value}</p>
        {subtext && <p className="mt-2 text-sm text-gray-600">{subtext}</p>}
      </div>
      {icon && (
        <div className="ml-3 text-3xl opacity-50">{icon}</div>
      )}
    </div>
  </div>
);

const ReportSummary = ({ report }: ReportSummaryProps) => {
  const { useList: getUsers } = useResourceLocked<User>("user");
  const { useList: getBillings } = useResourceLocked<BillingInfo>("billing");
  const { useList: getPayments } = useResourceLocked<PaymentHistory>("paymenthistory");
  
  const usersData = getUsers().data || [];
  const billingsData = getBillings().data || [];
  const paymentsData = getPayments().data || [];

  const liveStats = useMemo(() => {
    const activeUsers = usersData.filter((u) => u.emailAddress).length;
    const totalBillings = billingsData.length;
    const paidBillings = billingsData.filter((b) => b.status === "Paid").length;
    const unpaidBillings = billingsData.filter((b) => b.status === "Not Yet Paid").length;
    
    const totalBillable = billingsData.reduce((sum, b) => sum + parseFloat(b.amount || "0"), 0);
    const totalPaid = paymentsData
      .filter((p) => p.status === "Paid")
      .reduce((sum, p) => sum + parseFloat(p.amount || "0"), 0);

    return {
      activeUsers,
      totalBillings,
      paidBillings,
      unpaidBillings,
      totalBillable,
      totalPaid,
      collectionRate: totalBillable > 0 ? Math.round((totalPaid / totalBillable) * 100) : 0,
    };
  }, [usersData, billingsData, paymentsData]);

  if (!report) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <span className="text-3xl">📊</span>
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900">No Report Generated</h3>
          <p className="text-sm text-gray-600">
            Select a month, year, and status filter, then click "Generate" to see detailed payment reports
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-base font-semibold text-gray-900">Live System Overview</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Active Users"
              value={liveStats.activeUsers}
              bgColor="bg-blue-50"
              icon="👥"
            />
            <StatCard
              title="Total Billings"
              value={liveStats.totalBillings}
              subtext={`${liveStats.paidBillings} paid`}
              bgColor="bg-green-50"
              icon="📄"
            />
            <StatCard
              title="Total Revenue"
              value={`₱${liveStats.totalPaid.toLocaleString()}`}
              subtext={`${liveStats.collectionRate}% collected`}
              bgColor="bg-emerald-50"
              icon="💰"
            />
            <StatCard
              title="Pending"
              value={liveStats.unpaidBillings}
              subtext="unpaid bills"
              bgColor="bg-red-50"
              icon="⏳"
            />
          </div>
        </div>
      </div>
    );
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {monthNames[report.month]} {report.year} - Payment Report
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Generated: {new Date(report.generatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-full bg-white px-3 py-1 font-semibold text-indigo-600 shadow-sm">
            {report.items.length} Records
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Billable"
          value={`₱${report.totalBillable.toLocaleString()}`}
          subtext={`${report.summary.totalSubscribers} subscribers`}
          bgColor="bg-blue-50"
          icon="💵"
        />
        <StatCard
          title="Total Collected"
          value={`₱${report.totalCollected.toLocaleString()}`}
          subtext={`${report.summary.paidSubscribers} paid subscribers`}
          bgColor="bg-green-50"
          icon="✅"
        />
        <StatCard
          title="Total Pending"
          value={`₱${report.totalPending.toLocaleString()}`}
          subtext={`${report.summary.unpaidSubscribers} unpaid subscribers`}
          bgColor="bg-red-50"
          icon="⏰"
        />
        <StatCard
          title="Collection Rate"
          value={`${report.summary.collectionRate}%`}
          subtext={`${report.summary.partiallyPaidSubscribers} partially paid`}
          bgColor="bg-purple-50"
          icon="📊"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h4 className="mb-4 text-base font-semibold text-gray-900">Subscriber Breakdown</h4>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-4 text-center transition-all hover:shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Paid</p>
            <p className="mt-2 text-3xl font-extrabold text-green-600">
              {report.summary.paidSubscribers}
            </p>
            <p className="mt-1 text-xs text-green-600">
              {report.summary.totalSubscribers > 0 
                ? Math.round((report.summary.paidSubscribers / report.summary.totalSubscribers) * 100) 
                : 0}% of total
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 text-center transition-all hover:shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">Partially Paid</p>
            <p className="mt-2 text-3xl font-extrabold text-yellow-600">
              {report.summary.partiallyPaidSubscribers}
            </p>
            <p className="mt-1 text-xs text-yellow-600">
              {report.summary.totalSubscribers > 0 
                ? Math.round((report.summary.partiallyPaidSubscribers / report.summary.totalSubscribers) * 100) 
                : 0}% of total
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-red-50 to-red-100 p-4 text-center transition-all hover:shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Not Paid</p>
            <p className="mt-2 text-3xl font-extrabold text-red-600">
              {report.summary.unpaidSubscribers}
            </p>
            <p className="mt-1 text-xs text-red-600">
              {report.summary.totalSubscribers > 0 
                ? Math.round((report.summary.unpaidSubscribers / report.summary.totalSubscribers) * 100) 
                : 0}% of total
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 text-center transition-all hover:shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Total</p>
            <p className="mt-2 text-3xl font-extrabold text-indigo-600">
              {report.summary.totalSubscribers}
            </p>
            <p className="mt-1 text-xs text-indigo-600">
              of {liveStats.activeUsers} active users
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSummary;
