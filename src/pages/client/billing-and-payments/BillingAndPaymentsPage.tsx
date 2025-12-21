import { PLANS } from "@/constants";
import type { PaymentHistory } from "@/models/PaymentHistory";
import type { Plan } from "@/models/Plan";
import type { Subscription } from "@/models/Subscription";
import { useAuth } from "@saintrelion/auth-lib";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import { toast } from "@saintrelion/notifications";
import {
  formatReadableDate,
  formatReadableDateTime,
  toDate,
} from "@saintrelion/time-functions";
import { useState } from "react";

const BillingAndPaymentsPage = () => {
  const { user } = useAuth();

  /* ===================== PAYMENT HISTORY ===================== */
  const { useSelect: paymentHistorySelect, useInsert: paymentHistoryInsert } =
    useDBOperationsLocked<PaymentHistory>("PaymentHistory", false, false);
  const { data: paymentHistory } = paymentHistorySelect();

  const sortedPaymentHistory =
    paymentHistory && paymentHistory.length > 0
      ? [...paymentHistory].sort((a, b) => {
          const dateA = toDate(a.createdAt)?.getTime() ?? 0;
          const dateB = toDate(b.createdAt)?.getTime() ?? 0;
          return dateB - dateA;
        })
      : [];

  /* ===================== SUBSCRIPTION ===================== */
  const { useSelect: subscriptionSelect, useUpdate: subscriptionUpdate } =
    useDBOperationsLocked<Subscription>("Subscription", false, false);

  const { data: currentSubscriptions } = subscriptionSelect({
    firebaseOptions: {
      filterField: ["userId", "status"],
      value: [user.id, "Active"],
    },
  });

  const currentSubscription =
    currentSubscriptions && currentSubscriptions.length > 0
      ? currentSubscriptions[0]
      : null;

  const currentPlan: Plan | null = currentSubscription
    ? PLANS.find((p) => p.id === currentSubscription.planId) ?? null
    : null;

  /* ===================== UI STATE ===================== */
  const [showGcashModal, setShowGcashModal] = useState(false);

  /* ===================== DOWNLOAD QR ===================== */
  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.href = "/images/gcash.png";
    link.download = "gcash-qr.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("GCash QR Code downloaded");
  };

  /* ===================== HANDLE PAYMENT ===================== */
  async function handlePayment() {
    if (!currentSubscription || !currentPlan) return;

    const balance = Number(currentSubscription.balance);
    if (balance <= 0) {
      toast.info("All balance paid");
      return;
    }

    const randomAmount = Math.min(
      Math.floor(Math.random() * (800 - 100 + 1)) + 100,
      balance,
    );

    const remainingBalance = balance - randomAmount;
    const status = remainingBalance > 0 ? "pending" : "complete";

    await paymentHistoryInsert.run({
      userId: user.id,
      description: currentPlan.name,
      amount: randomAmount.toString(),
      status,
      invoice: `INV-${Date.now()}`,
    });

    await subscriptionUpdate.run({
      field: "id",
      value: currentSubscription.id,
      updates: { balance: remainingBalance.toString() },
    });

    toast.success(`PHP ${randomAmount} recorded`);
  }

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
      <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white">
        {currentSubscription && currentPlan ? (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold">Current Subscription</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Info label="Plan" value={currentPlan.name} />
              <Info label="Status" value={currentSubscription.status} />
              <Info
                label="Next Due Date"
                value={formatReadableDate(
                  currentSubscription.nextBillingDate,
                )}
              />
              <Info
                label="Outstanding Balance"
                value={`₱${currentSubscription.balance}`}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handlePayment}
                className="w-full rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 sm:w-auto"
              >
                Pay via Oxygen
              </button>

              <button
                onClick={() => setShowGcashModal(true)}
                className="w-full rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 sm:w-auto"
              >
                Pay via GCash
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center font-semibold">No Active Subscription</p>
        )}
      </div>

      {/* ===================== GCASH MODAL ===================== */}
      {showGcashModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-indigo-700 text-center">
              GCash Payment
            </h2>
            <p className="mb-4 text-sm text-gray-500 text-center">
              Scan this QR using your GCash app
            </p>

            <img
              src="/images/gcash.png"
              alt="GCash QR Code"
              className="mx-auto mb-4 w-48 rounded-lg shadow sm:w-56"
            />

            {/* ===== HOW TO PAY (KEPT) ===== */}
            <div className="mb-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
              <p className="mb-2 font-semibold text-indigo-700">
                How to pay:
              </p>
              <ol className="ml-5 list-decimal space-y-1">
                <li>Open the GCash app</li>
                <li>
                  Tap <strong>Pay QR</strong>
                </li>
                <li>
                  Select <strong>Upload QR</strong> or scan directly
                </li>
                <li>
                  Enter the exact amount:
                  <strong className="ml-1">₱{currentSubscription?.balance}</strong>
                </li>
                <li>Confirm payment</li>
              </ol>
            </div>

            <button
              onClick={downloadQRCode}
              className="mb-3 w-full rounded-lg border border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
            >
              Download QR Code
            </button>

            <button
              onClick={() => setShowGcashModal(false)}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ===================== PAYMENT HISTORY ===================== */}
      <div className="rounded-xl bg-white p-4 shadow sm:p-6">
        <h3 className="mb-4 text-lg font-semibold">Payment History</h3>

        <div className="overflow-x-auto">
          <table className="min-w-[640px] w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-left">Amount</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {sortedPaymentHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No payment history
                  </td>
                </tr>
              ) : (
                sortedPaymentHistory.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2">
                      {formatReadableDateTime(p.createdAt)}
                    </td>
                    <td className="px-3 py-2">{p.description}</td>
                    <td className="px-3 py-2 font-medium">₱{p.amount}</td>
                    <td className="px-3 py-2 capitalize">{p.status}</td>
                    <td className="px-3 py-2 text-right text-indigo-600">
                      {p.invoice}
                    </td>
                  </tr>
                ))
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
