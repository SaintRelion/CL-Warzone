import ProcessPayment, {
  type PaymentMethods,
} from "@/components/billing/ProcessPayment";
import type { UserBillingInfo } from "@/models/Billing";
import type { PaymentHistory } from "@/models/PaymentHistory";
import type { UserSubscription } from "@/models/subscription";
import { useBillingStore } from "@/stores/billing/useBillingStore";
import { useCurrentUser } from "@saintrelion/auth-lib";
import {
  useResourceLocked,
  type Paginated,
} from "@saintrelion/data-access-layer";
import { toast } from "@saintrelion/notifications";
import {
  formatReadableDate,
  formatReadableDateTime,
  sortByTime,
} from "@saintrelion/time-functions";
import { useState } from "react";

const BillingAndPaymentsPage = () => {
  const user = useCurrentUser();

  /* ===================== PAYMENT HISTORY ===================== */
  const { useList: getPaymentHistories } = useResourceLocked<
    Paginated<PaymentHistory>
  >("paymenthistory", {
    showToast: false,
  });

  const paymentHistories = getPaymentHistories({
    filters: {
      user: user.id,
    },
  }).data;

  /* ===================== SUBSCRIPTION ===================== */
  const { useList: getUserSubscriptions } = useResourceLocked<
    Paginated<UserSubscription>
  >("usersubscription", { showToast: false });

  const currentSubscriptions = getUserSubscriptions({
    filters: { user: user.id },
  }).data;

  const { useList: getUserBilling } =
    useResourceLocked<Paginated<UserBillingInfo>>("userbilling");

  const processPayment = useBillingStore((s) => s.processPayment);

  /* ===================== UI STATE ===================== */
  const [selectedPayment, setSelectedPayment] = useState("");

  const currentSubscription =
    currentSubscriptions && currentSubscriptions.results.length > 0
      ? currentSubscriptions.results[0]
      : null;

  const myActiveBilling = getUserBilling({
    filters: {
      user: user.id,
      subscription: currentSubscription ? currentSubscription.id : -1,
    },
  }).data;

  if (!paymentHistories) return <div>Loading...</div>;

  const sortedActiveBilling = myActiveBilling
    ? sortByTime(myActiveBilling.results, "due_date")
    : [];

  const sortedPaymentHistories = sortByTime(
    paymentHistories.results,
    "created_at",
  );

  /* ===================== DOWNLOAD QR ===================== */
  const downloadQRCode = (qrCode: string) => {
    const link = document.createElement("a");
    link.href = `/images/${qrCode}.jpg`;
    link.download = `${qrCode}-qr.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${qrCode} QR Code downloaded`);
  };

  return (
    <div className="space-y-8 p-4 sm:p-6">
      {/* ===================== HEADER ===================== */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Billing & Payments
        </h2>
        <p className="text-sm text-gray-500">
          Manage your subscription and payments
        </p>
      </div>
      {/* ===================== SUBSCRIPTION CARD ===================== */}
      <div className="rounded-xl bg-indigo-600 p-5 font-semibold text-white shadow-lg">
        {currentSubscription ? (
          <div className="space-y-5">
            <h3 className="text-lg font-bold">Current Subscription</h3>

            {/* ===================== APPROVAL PROCESS STEPS ===================== */}
            <div className="mb-4 flex items-center gap-3">
              {/* Step 1: Plan Chosen */}
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 font-bold text-white">
                  ✓
                </div>
                <span>Plan Chosen</span>
              </div>

              <div className="h-1 flex-1 bg-white/50"></div>

              {/* Step 2: Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full font-bold ${
                    currentSubscription.status === "pending"
                      ? "bg-yellow-500 text-white" // waiting approval
                      : currentSubscription.status === "active"
                        ? "bg-green-500 text-white" // approved & active
                        : currentSubscription.status === "suspended"
                          ? "bg-gray-400 text-white" // temporarily suspended
                          : "bg-red-500 text-white" // cancelled
                  }`}
                >
                  {currentSubscription.status === "pending"
                    ? "!"
                    : currentSubscription.status === "active"
                      ? "✓"
                      : currentSubscription.status === "suspended"
                        ? "–"
                        : "✕"}
                </div>
                <span>
                  {currentSubscription.status === "pending"
                    ? "Approval Pending"
                    : currentSubscription.status === "active"
                      ? "Active"
                      : currentSubscription.status === "suspended"
                        ? "Suspended"
                        : "Cancelled"}
                </span>
              </div>
            </div>

            {/* ===================== SUBSCRIPTION INFO ===================== */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Info label="Plan" value={currentSubscription.plan.name} />
              <Info label="Status" value={currentSubscription.status} />
              {sortedActiveBilling.length > 0 && (
                <Info
                  label="Next Due Date"
                  value={formatReadableDate(sortedActiveBilling[0].due_date)}
                />
              )}
              <Info
                label="Outstanding Balance"
                value={`₱${currentSubscription.amount ?? 0}`}
              />
            </div>

            {/* ===================== PAYMENT BUTTON ===================== */}

            <div className="flex flex-col gap-3 sm:flex-row">
              {["GCASH", "METROBANK", "RCBC"].map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedPayment(method as PaymentMethods)}
                  className="w-full rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 sm:w-auto"
                >
                  Pay via {method.charAt(0) + method.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center font-semibold">No Active Subscription</p>
        )}
      </div>

      {/* ===================== GCASH MODAL ===================== */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
            <h2 className="text-center text-lg font-semibold text-indigo-700">
              {selectedPayment} Payment
            </h2>

            <p className="mb-4 text-center text-sm text-gray-500">
              Scan this QR using your {selectedPayment} app
            </p>

            <img
              src={`/images/${selectedPayment}.jpg`}
              alt={`${selectedPayment} QR Code`}
              className="mx-auto mb-4 w-48 rounded-lg shadow sm:w-56"
            />

            <div className="mb-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
              <p className="mb-2 font-semibold text-indigo-700">How to pay:</p>
              <ol className="ml-5 list-decimal space-y-1">
                <li>Open the {selectedPayment} app</li>
                <li>Scan or upload the QR code</li>
                <li>
                  Enter the exact amount:
                  <strong className="ml-1">
                    ₱{currentSubscription?.amount}
                  </strong>
                </li>
                <li>Confirm payment</li>
              </ol>
            </div>

            <button
              onClick={() => downloadQRCode(selectedPayment)}
              className="mb-3 w-full rounded-lg border border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
            >
              Download QR Code
            </button>

            <button
              disabled={sortedActiveBilling.length <= 0}
              onClick={() => {
                processPayment(sortedActiveBilling[0]); // activate store session
              }}
              className="mb-3 w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Confirm Payment
            </button>

            <button
              onClick={() => setSelectedPayment("")}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {selectedPayment != "" && (
        <ProcessPayment paymentMethod={selectedPayment as PaymentMethods} />
      )}

      <div className="rounded-xl bg-white p-4 shadow sm:p-6">
        <h3 className="mb-4 text-lg font-semibold">Payment History</h3>

        <div className="overflow-x-auto">
          <table className="w-full min-w-160 text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Amount</th>
                <th className="px-3 py-2 text-left">Method</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedPaymentHistories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    No payment history
                  </td>
                </tr>
              ) : (
                sortedPaymentHistories.map((p) => {
                  const statusStyles = {
                    pending: "bg-yellow-100 text-yellow-700",
                    completed: "bg-green-100 text-green-700",
                    voided: "bg-red-100 text-red-700",
                  };

                  const statusLabels = {
                    pending: "⏳ Pending",
                    completed: "✓ Completed",
                    voided: "✕ Voided",
                  };

                  const isCash = p.method === "CASH";

                  return (
                    <tr
                      key={p.id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-3 py-2">
                        {formatReadableDateTime(p.created_at)}
                      </td>
                      <td className="px-3 py-2 font-medium">₱{p.amount}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex w-fit items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                            {p.method}
                          </span>

                          {!isCash && (
                            <span className="text-xs text-gray-600">
                              Ref:{" "}
                              <span className="font-mono font-semibold text-gray-800">
                                {p.transaction_ref || "—"}
                              </span>
                            </span>
                          )}

                          {p.transaction_screenshot && !isCash && (
                            <button
                              onClick={() =>
                                window.open(p.transaction_screenshot, "_blank")
                              }
                              className="text-xs text-blue-600 hover:underline"
                            >
                              View Screenshot
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ${
                            statusStyles[p.status as keyof typeof statusStyles]
                          }`}
                        >
                          {statusLabels[p.status as keyof typeof statusLabels]}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ===================== SMALL INFO CARD ===================== */
const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg bg-white/10 p-4">
    <p className="text-xs text-indigo-200">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

export default BillingAndPaymentsPage;
