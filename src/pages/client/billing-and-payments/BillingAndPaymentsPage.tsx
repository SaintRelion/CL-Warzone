import type { UserBillingInfo } from "@/models/Billing";
import type { PaymentHistory } from "@/models/PaymentHistory";
import type { UserSubscription } from "@/models/subscription";
import { useCurrentUser } from "@saintrelion/auth-lib";
import { useResourceLocked } from "@saintrelion/data-access-layer";
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
  const { useList: getPaymentHistories } = useResourceLocked<PaymentHistory>(
    "paymenthistory",
    {
      showToast: false,
    },
  );

  const paymentHistories = sortByTime(
    getPaymentHistories({
      filters: {
        user: user.id,
      },
    }).data,
    "created_at",
  );

  /* ===================== SUBSCRIPTION ===================== */
  const { useList: getUserSubscriptions } = useResourceLocked<UserSubscription>(
    "usersubscription",
    { showToast: false },
  );

  const currentSubscriptions = getUserSubscriptions({
    filters: { user: user.id },
  }).data;

  const currentSubscription =
    currentSubscriptions.length > 0 ? currentSubscriptions[0] : null;

  const { useList: getUserBilling } =
    useResourceLocked<UserBillingInfo>("userbilling");

  const myActiveBilling = getUserBilling({
    filters: {
      user: user.id,
      subscription: currentSubscription ? currentSubscription.id : -1,
    },
  }).data;

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
      <div className="rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 p-5 text-white">
        {currentSubscription ? (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold">Current Subscription</h3>

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
              {myActiveBilling?.[0] && (
                <Info
                  label="Next Due Date"
                  value={formatReadableDate(myActiveBilling[0].due_date)}
                />
              )}
              <Info
                label="Outstanding Balance"
                value={`₱${currentSubscription.amount ?? 0}`}
              />
            </div>

            {/* ===================== PAYMENT BUTTON ===================== */}
            {currentSubscription.status === "active" && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setShowGcashModal(true)}
                  className="w-full rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 sm:w-auto"
                >
                  Pay via GCash
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center font-semibold">No Active Subscription</p>
        )}
      </div>

      {/* ===================== GCASH MODAL ===================== */}
      {showGcashModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
            <h2 className="text-center text-lg font-semibold text-indigo-700">
              GCash Payment
            </h2>
            <p className="mb-4 text-center text-sm text-gray-500">
              Scan this QR using your GCash app
            </p>

            <img
              src="/images/gcash.png"
              alt="GCash QR Code"
              className="mx-auto mb-4 w-48 rounded-lg shadow sm:w-56"
            />

            {/* ===== HOW TO PAY (KEPT) ===== */}
            <div className="mb-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
              <p className="mb-2 font-semibold text-indigo-700">How to pay:</p>
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
                  <strong className="ml-1">
                    ₱{currentSubscription?.amount}
                  </strong>
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
          <table className="w-full min-w-160 text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                {/* <th className="px-3 py-2 text-left">Description</th> */}
                <th className="px-3 py-2 text-left">Amount</th>
                <th className="px-3 py-2 text-left">Status</th>
                {/* <th className="px-3 py-2 text-right">Invoice</th> */}
              </tr>
            </thead>
            <tbody>
              {paymentHistories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No payment history
                  </td>
                </tr>
              ) : (
                paymentHistories.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2">
                      {formatReadableDateTime(p.created_at)}
                    </td>
                    <td className="px-3 py-2 font-medium">₱{p.amount}</td>
                    <td className="px-3 py-2 capitalize">{p.status}</td>
                    <td className="px-3 py-2 text-right text-indigo-600">
                      {p.transaction_screenshot}
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
