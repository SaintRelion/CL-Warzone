import type { UserBillingInfo } from "@/models/Billing";
import { useBillingStore } from "@/stores/billing/useBillingStore";
import { useMemo } from "react";

const KPICards = ({
  userBillings,
  currentMonth,
  currentYear,
}: {
  userBillings: UserBillingInfo[];
  currentMonth: number;
  currentYear: number;
}) => {
  const setBillingFilter = useBillingStore((s) => s.setBillingFilter);

  const billingStats = useMemo(() => {
    const base = {
      paid: 0,
      unpaid: 0,
      thisMonth: 0,
      revenue: 0,
      total: userBillings.length,
    };

    return userBillings.reduce((acc, b) => {
      const created = new Date(b.created_at);

      if (b.status === "paid") {
        acc.paid += 1;
        acc.revenue += parseInt(b.amount);
      } else {
        acc.unpaid += 1;
      }

      if (
        created.getMonth() === currentMonth &&
        created.getFullYear() === currentYear
      ) {
        acc.thisMonth += 1;
      }

      return acc;
    }, base);
  }, [userBillings, currentMonth, currentYear]);

  const statCards = [
    {
      key: "paid",
      label: "Total Paid",
      value: billingStats.paid,
      icon: "✓",
      color: "indigo",
      onClick: () => setBillingFilter("paid"),
      percent: (billingStats.paid / billingStats.total) * 100,
    },
    {
      key: "unpaid",
      label: "Unpaid",
      value: billingStats.unpaid,
      icon: "⏳",
      color: "yellow",
      onClick: () => setBillingFilter("unpaid"),
      percent: (billingStats.unpaid / billingStats.total) * 100,
    },
    {
      key: "month",
      label: "This Month (Bills)",
      value: billingStats.thisMonth,
      icon: "📅",
      color: "green",
      onClick: () => setBillingFilter("this-month"),
      percent: (billingStats.thisMonth / billingStats.total) * 100,
    },
    {
      key: "revenue",
      label: "Total Revenue",
      value: `₱${billingStats.revenue.toLocaleString()}`,
      icon: "💰",
      color: "purple",
      onClick: () => setBillingFilter("all"),
      percent: 100,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => (
        <button
          key={card.key}
          type="button"
          onClick={card.onClick}
          className={`group relative flex flex-col justify-center overflow-hidden rounded-xl border border-${card.color}-200 bg-linear-to-br from-${card.color}-50 to-${card.color}-100 p-4 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md focus:ring-2 focus:outline-hidden focus:ring-${card.color}-400`}
        >
          {/* Header Row: Icon and Label together */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="shrink-0 text-base opacity-70 transition-opacity group-hover:opacity-100">
                {card.icon}
              </span>
              <p
                className={`truncate text-[14px] font-black tracking-tight uppercase text-${card.color}-600`}
              >
                {card.label}
              </p>
            </div>
            {/* Optional: Small percentage badge if you want it visible textually */}
            <span className={`text-[14px] font-bold text-${card.color}-500`}>
              {Number(card.percent || 0).toFixed(2)}%
            </span>
          </div>

          {/* Value Row */}
          <p
            className={`mt-1 truncate text-2xl font-black text-${card.color}-800`}
          >
            {card.value}
          </p>

          {/* Progress Bar - Slimmed down */}
          <div
            className={`mt-2 h-1 w-full rounded-full bg-${card.color}-200/50`}
          >
            <div
              className={`h-1 rounded-full bg-${card.color}-600 transition-all duration-500`}
              style={{ width: `${card.percent || 0}%` }}
            />
          </div>
        </button>
      ))}
    </div>
  );
};
export default KPICards;
