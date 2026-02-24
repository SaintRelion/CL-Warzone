import type { User } from "@/models/user";
import type { UserBillingInfo } from "@/models/Billing";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { useMemo } from "react";
import { useAdminReportingStore } from "@/stores/admin-reporting/useAdminReportingStore";
import { MONTH_NAMES } from "./constants";

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
        <p className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
          {title}
        </p>
        <p className="mt-3 text-3xl font-extrabold text-gray-900">{value}</p>
        {subtext && <p className="mt-2 text-sm text-gray-600">{subtext}</p>}
      </div>
      {icon && <div className="ml-3 text-3xl opacity-50">{icon}</div>}
    </div>
  </div>
);

const ReportSummary = () => {
  const report = useAdminReportingStore((s) => s.report);

  const { useList: getUsers } = useResourceLocked<User>("user");
  const { useList: getUserBilling } =
    useResourceLocked<UserBillingInfo>("userbilling");

  const users = getUsers().data;
  const userBillings = getUserBilling().data;

  const liveStats = useMemo(() => {
    const activeUsers = users.filter(
      (u) => u.email && u.roles?.find((r) => r == "client"),
    ).length;

    const paidBillings = userBillings.filter((b) => b.status === "Paid");
    const unpaidBillings = userBillings.filter((b) => b.status != "Paid");

    const totalBillable = userBillings.reduce(
      (sum, b) => sum + parseFloat(b.amount || "0"),
      0,
    );

    const totalRevenue = paidBillings.reduce(
      (sum, b) => sum + parseFloat(b.amount || "0"),
      0,
    );
    const totalUnpaid = unpaidBillings.reduce(
      (sum, b) => sum + parseFloat(b.amount || "0"),
      0,
    );

    return {
      activeUsers,
      totalBillable,
      totalRevenue,
      totalUnpaid,
      collectionRate:
        totalBillable > 0
          ? Math.round((totalRevenue / totalBillable) * 100)
          : 0,
    };
  }, [users, userBillings]);

  if (!report) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-dashed border-gray-300 bg-linear-to-br from-gray-50 to-gray-100 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <span className="text-3xl">📊</span>
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900">
            No Report Generated
          </h3>
          <p className="text-sm text-gray-600">
            Select a month, year, and status filter, then click "Generate" to
            see detailed payment reports
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-base font-semibold text-gray-900">
            Live System Overview
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Active Users"
              value={liveStats.activeUsers}
              bgColor="bg-blue-50"
              icon="👥"
            />
            <StatCard
              title="Total Revenue"
              value={liveStats.totalRevenue}
              subtext="paid bills"
              bgColor="bg-green-50"
              icon="⏳"
            />
            <StatCard
              title="Total Unpaid"
              value={liveStats.totalUnpaid}
              subtext="unpaid bills"
              bgColor="bg-red-50"
              icon="⏳"
            />
            <StatCard
              title="Collection Rate"
              value={`${liveStats.collectionRate.toLocaleString()}%`}
              subtext={`All time collected`}
              bgColor="bg-emerald-50"
              icon="💰"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl bg-linear-to-r from-indigo-50 to-purple-50 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {MONTH_NAMES[report.month]} {report.year} - Payment Report
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Generated: {new Date(report.generated_at).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-full bg-white px-3 py-1 font-semibold text-indigo-600 shadow-sm">
            {report.items.length} record/s
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Billable"
          value={`₱${report.total_billable.toLocaleString()}`}
          subtext={`${report.summary.total_subscribers} subscribers`}
          bgColor="bg-blue-50"
          icon="💵"
        />
        <StatCard
          title="Total Revenue"
          value={`₱${report.total_revenue.toLocaleString()}`}
          subtext={`${report.summary.paid_subscribers} paid subscribers`}
          bgColor="bg-green-50"
          icon="✅"
        />
        <StatCard
          title="Total Unpaid"
          value={`₱${report.total_unpaid.toLocaleString()}`}
          subtext={`${report.summary.unpaid_subscribers} unpaid subscribers`}
          bgColor="bg-red-50"
          icon="⏰"
        />
        <StatCard
          title="Collection Rate"
          value={`${report.summary.collection_rate}%`}
          subtext={`Monthly targets paid`}
          bgColor="bg-purple-50"
          icon="📊"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h4 className="mb-4 text-base font-semibold text-gray-900">
          Payment Reconciliation
        </h4>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* TOTAL COLLECTED */}
          <div className="rounded-lg bg-linear-to-br from-blue-50 to-blue-100 p-4 text-center">
            <p className="text-xs font-semibold text-blue-700 uppercase">
              Total Collected
            </p>
            <p className="mt-2 text-3xl font-extrabold text-blue-600">
              ₱{report.summary.total_collected.toLocaleString()}
            </p>
          </div>

          {/* CHANGE GIVEN */}
          <div className="rounded-lg bg-linear-to-br from-green-50 to-green-100 p-4 text-center">
            <p className="text-xs font-semibold text-green-700 uppercase">
              Change Given
            </p>
            <p className="mt-2 text-3xl font-extrabold text-green-600">
              ₱{report.summary.total_change_given_back.toLocaleString()}
            </p>
          </div>

          {/* CREDITS ISSUED */}
          <div className="rounded-lg bg-linear-to-br from-indigo-50 to-indigo-100 p-4 text-center">
            <p className="text-xs font-semibold text-indigo-700 uppercase">
              Credits Issued
            </p>
            <p className="mt-2 text-3xl font-extrabold text-indigo-600">
              ₱{report.summary.total_credits.toLocaleString()}
            </p>
          </div>

          {/* NET REVENUE */}
          <div className="rounded-lg bg-linear-to-br from-purple-50 to-purple-100 p-4 text-center">
            <p className="text-xs font-semibold text-purple-700 uppercase">
              Net Revenue
            </p>
            <p className="mt-2 text-3xl font-extrabold text-purple-600">
              ₱{report.summary.net_revenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSummary;
