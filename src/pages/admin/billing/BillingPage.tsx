import BillingTable from "@/components/billing/BillingTable";
import type { UserBillingInfo } from "@/models/Billing";
import type {
  CreatePaymentHistory,
  PaymentHistory,
} from "@/models/PaymentHistory";
import {
  useResourceLocked,
  type Paginated,
} from "@saintrelion/data-access-layer";
import ReceiptView from "../../../components/billing/ReceiptView";
import ProcessPayment from "@/components/billing/ProcessPayment";
import PaymentHistoryTable from "@/components/billing/PaymentHistoryTable";
import KPICards from "@/components/billing/KPICards";
import { sortByTime } from "@saintrelion/time-functions";

const BillingPage = () => {
  const { useList: getUserBilling } = useResourceLocked<
    Paginated<UserBillingInfo>
  >("userbilling", { showToast: false });
  const { useList: getPaymentHistory } = useResourceLocked<
    Paginated<PaymentHistory>,
    CreatePaymentHistory
  >("paymenthistory", { showToast: false });

  const userBilling = getUserBilling().data;
  const paymentHistories = getPaymentHistory().data;

  if (!userBilling || !paymentHistories) return <div>Loading...</div>;

  const sortedBilling = sortByTime(userBilling.results, "due_date");
  const sortedPaymentHistories = sortByTime(
    paymentHistories.results,
    "created_at",
  );

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-8xl mx-auto space-y-6">
        {/* <div>
          <h2 className="mb-1 text-4xl font-black text-gray-900">
            Cashiering & Billing
          </h2>
          <p className="text-sm font-semibold text-gray-700">
            Manage payments, receipts, and billing cycles
          </p>
        </div> */}

        {/* SUMMARY CARDS and Filters */}
        <KPICards
          userBillings={sortedBilling}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />

        {/* DATA TABLE - Improved UI */}
        <BillingTable
          userBillings={sortedBilling}
          paymentHistories={sortedPaymentHistories}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />

        {/* RECEIPT PREVIEW - THERMAL PRINTER FORMAT */}
        <ReceiptView />

        {/* CASHIERING MODAL */}
        <ProcessPayment paymentMethod="CASH" />

        {/* PAYMENT HISTORY MODAL */}
        <PaymentHistoryTable paymentHistories={sortedPaymentHistories} />
      </div>
    </div>
  );
};

export default BillingPage;
