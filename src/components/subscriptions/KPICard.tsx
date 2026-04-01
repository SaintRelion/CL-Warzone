import type { UserSubscription } from "@/models/subscription";

const KPICard = ({ subscriptions }: { subscriptions: UserSubscription[] }) => {
  // Calculate stats
  const pendingSubscriptions = subscriptions.filter(
    (s) => s.status === "pending",
  ).length;
  const suspendedSubscriptions = subscriptions.filter(
    (s) => s.status === "suspended",
  ).length;
  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "active",
  ).length;
  const totalBillable = subscriptions.reduce(
    (sum, s) => sum + parseFloat(s.amount),
    0,
  );

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {/* Pending Subscriptions */}
      <div className="flex flex-col justify-center rounded-xl border border-blue-200 bg-linear-to-br from-blue-50 to-blue-100 p-4 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-lg opacity-60">⏳</span>
          <p className="truncate text-[12px] font-bold tracking-tight text-orange-600 uppercase">
            Pending
          </p>
        </div>
        <p className="mt-1 truncate text-2xl font-black text-orange-900">
          {pendingSubscriptions}
        </p>
      </div>

      {/* Suspended Subscriptions */}
      <div className="flex flex-col justify-center rounded-xl border border-blue-200 bg-linear-to-br from-blue-50 to-blue-100 p-4 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-lg opacity-60">⚠️</span>
          <p className="truncate text-[12px] font-bold tracking-tight text-red-600 uppercase">
            Suspended
          </p>
        </div>
        <p className="mt-1 truncate text-2xl font-black text-red-900">
          {suspendedSubscriptions}
        </p>
      </div>

      {/* Active Subscriptions */}
      <div className="flex flex-col justify-center rounded-xl border border-green-200 bg-linear-to-br from-green-50 to-green-100 p-4 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-lg opacity-60">✅</span>
          <p className="truncate text-[12px] font-bold tracking-tight text-green-600 uppercase">
            Active
          </p>
        </div>
        <p className="mt-1 truncate text-2xl font-black text-green-900">
          {activeSubscriptions}
        </p>
      </div>

      {/* Total Billable */}
      <div className="flex flex-col justify-center rounded-xl border border-purple-200 bg-linear-to-br from-purple-50 to-purple-100 p-4 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-lg opacity-60">💰</span>
          <p className="truncate text-[12px] font-bold tracking-tight text-purple-600 uppercase">
            Billable
          </p>
        </div>
        <div className="mt-1 flex items-baseline gap-0.5 overflow-hidden text-xl font-black text-purple-900 sm:text-2xl">
          <span className="text-xs font-bold text-purple-700">₱</span>
          <span className="truncate">
            {totalBillable.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
export default KPICard;
