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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
      <div className="rounded-xl border border-blue-200 bg-linear-to-br from-blue-50 to-blue-100 p-5 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-orange-600 uppercase">
              Pending Subscriptions
            </p>
            <p className="text-ornage-900 mt-2 text-3xl font-black">
              {pendingSubscriptions}
            </p>
          </div>
          <div className="text-4xl opacity-20">⏳</div>
        </div>
      </div>

      <div className="rounded-xl border border-blue-200 bg-linear-to-br from-blue-50 to-blue-100 p-5 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-red-600 uppercase">
              Suspended Subscriptions
            </p>
            <p className="text-ornage-900 mt-2 text-3xl font-black">
              {suspendedSubscriptions}
            </p>
          </div>
          <div className="text-4xl opacity-20">⚠</div>
        </div>
      </div>

      <div className="rounded-xl border border-green-200 bg-linear-to-br from-green-50 to-green-100 p-5 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-green-600 uppercase">
              Active Subcriptions
            </p>
            <p className="mt-2 text-3xl font-black text-green-900">
              {activeSubscriptions}
            </p>
          </div>
          <div className="text-4xl opacity-20">✓</div>
        </div>
      </div>

      <div className="rounded-xl border border-purple-200 bg-linear-to-br from-purple-50 to-purple-100 p-5 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-purple-600 uppercase">
              Total Billable
            </p>
            <p className="mt-2 text-3xl font-black text-purple-900">
              ₱
              {totalBillable.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="text-4xl opacity-20">💰</div>
        </div>
      </div>
    </div>
  );
};
export default KPICard;
