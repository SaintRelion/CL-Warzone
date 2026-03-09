import type { UserBillingInfo } from "@/models/Billing";
import type { PaymentHistory } from "@/models/PaymentHistory";
import { useBillingStore } from "@/stores/billing/useBillingStore";
import { formatReadableDate } from "@saintrelion/time-functions";
import { HandCoins, History, Receipt } from "lucide-react";

const BillingActions = ({
  userBill,
  paymentHistory,
}: {
  userBill: UserBillingInfo;
  paymentHistory: PaymentHistory | undefined;
}) => {
  const printReceipt = useBillingStore((s) => s.printReceipt);
  const processPayment = useBillingStore((s) => s.processPayment);
  const viewPaymentHistory = useBillingStore((s) => s.viewPaymentHistory);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Print Receipt Button - Only for Paid Payments */}
      {userBill.status === "paid" && (
        <button
          onClick={() => {
            if (!paymentHistory) {
              alert(
                "No paid payment found for this bill. Bill ID: " + userBill.id,
              );
              return;
            }

            printReceipt(userBill, {
              ...paymentHistory,
              created_at: formatReadableDate(paymentHistory.created_at),
            });
          }}
          title="Print Receipt - View and print payment receipt"
          className="rounded-lg bg-indigo-600 p-2 text-white shadow transition-all duration-150 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:outline-none active:scale-95"
        >
          <Receipt className="h-4 w-4" />
        </button>
      )}

      {/* Cashiering Button - Only for Pending Payments */}
      {userBill.status === "unpaid" && (
        <button
          onClick={() => processPayment(userBill)}
          title="Process Payment - Collect payment from customer"
          className="rounded-lg bg-green-600 p-2 text-white shadow transition-all duration-150 hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:outline-none active:scale-95"
        >
          <HandCoins className="h-4 w-4" />
        </button>
      )}

      {/* View Payment History Button */}
      <button
        onClick={() => {
          viewPaymentHistory(userBill);
        }}
        title="View Payment History - See all payments from this customer"
        className="rounded-lg bg-blue-600 p-2 text-white shadow transition-all duration-150 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none active:scale-95"
      >
        <History className="h-4 w-4" />
      </button>
    </div>
  );
};
export default BillingActions;
