import type { UserBillingInfo } from "@/models/Billing";
import { useBillingStore } from "@/stores/billing/useBillingStore";
import { useMemo } from "react";

const KPICards = ({
  userBillings: userBilling,
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
      total: userBilling.length,
    };

    return userBilling.reduce((acc, b) => {
      const created = new Date(b.created_at);

      if (b.status === "Paid") {
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
  }, [userBilling, currentMonth, currentYear]);

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
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={card.onClick}
            className={`transform rounded-xl border border-${card.color}-200 bg-linear-to-br from-${card.color}-50 to-${card.color}-100 p-5 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:ring-2 focus:ring-${card.color}-400`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-bold text-${card.color}-600`}>
                  {card.label}
                </p>
                <p
                  className={`mt-1 text-3xl font-black text-${card.color}-700`}
                >
                  {card.value}
                </p>
              </div>
              <div className="text-4xl opacity-20">{card.icon}</div>
            </div>

            <div
              className={`mt-3 h-1.5 w-full rounded-full bg-${card.color}-200`}
            >
              <div
                className={`h-1.5 rounded-full bg-${card.color}-600`}
                style={{ width: `${card.percent || 0}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </>
  );
};
export default KPICards;
