import BillingTable from "@/components/billing/BillingTable";
import type { UserBillingInfo } from "@/models/Billing";
import type {
  CreatePaymentHistory,
  PaymentHistory,
} from "@/models/PaymentHistory";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import ReceiptView from "../../../components/billing/ReceiptView";
import ProcessPayment from "@/components/billing/ProcessPayment";
import PaymentHistoryTable from "@/components/billing/PaymentHistoryTable";
import KPICards from "@/components/billing/KPICards";
import { sortByTime } from "@saintrelion/time-functions";

const BillingPage = () => {
  const { useList: getUserBilling } = useResourceLocked<UserBillingInfo>(
    "userbilling",
    { showToast: false },
  );
  const { useList: getPaymentHistory } = useResourceLocked<
    PaymentHistory,
    CreatePaymentHistory
  >("paymenthistory", { showToast: false });

  const userBilling = sortByTime(getUserBilling().data, "due_date");
  const paymentHistories = getPaymentHistory().data || [];

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-8xl mx-auto space-y-6">
        <div>
          <h2 className="mb-1 text-4xl font-black text-gray-900">
            Cashiering & Billing
          </h2>
          <p className="text-sm font-semibold text-gray-700">
            Manage payments, receipts, and billing cycles
          </p>
        </div>

        {/* SUMMARY CARDS and Filters */}
        <KPICards
          userBillings={userBilling}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />

        {/* DATA TABLE - Improved UI */}
        <BillingTable
          userBillings={userBilling}
          paymentHistories={paymentHistories}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />

        {/* RECEIPT PREVIEW - THERMAL PRINTER FORMAT */}
        <ReceiptView />

        {/* CASHIERING MODAL */}
        <ProcessPayment />

        {/* PAYMENT HISTORY MODAL */}
        <PaymentHistoryTable paymentHistories={paymentHistories} />
      </div>
    </div>
  );
};

export default BillingPage;
