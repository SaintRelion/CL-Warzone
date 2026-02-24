import type { Subscription } from "@/models/subscription";

const KPICard = ({ subscriptions }: { subscriptions: Subscription[] }) => {
  // Calculate stats
  const totalSubscribers = subscriptions.length;
  const activeSubscribers = subscriptions.filter(
    (s) => s.status === "Active",
  ).length;
  const totalBalance = subscriptions.reduce(
    (sum, s) => sum + parseFloat(s.amount),
    0,
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-blue-200 bg-linear-to-br from-blue-50 to-blue-100 p-5 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
              Total Subscribers
            </p>
            <p className="mt-2 text-3xl font-black text-blue-900">
              {totalSubscribers}
            </p>
          </div>
          <div className="text-4xl opacity-20">👥</div>
        </div>
      </div>

      <div className="rounded-xl border border-green-200 bg-linear-to-br from-green-50 to-green-100 p-5 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-green-600 uppercase">
              Active Subscribers
            </p>
            <p className="mt-2 text-3xl font-black text-green-900">
              {activeSubscribers}
            </p>
          </div>
          <div className="text-4xl opacity-20">✓</div>
        </div>
      </div>

      <div className="rounded-xl border border-purple-200 bg-linear-to-br from-purple-50 to-purple-100 p-5 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-purple-600 uppercase">
              Total Balance
            </p>
            <p className="mt-2 text-3xl font-black text-purple-900">
              ₱
              {totalBalance.toLocaleString("en-PH", {
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
