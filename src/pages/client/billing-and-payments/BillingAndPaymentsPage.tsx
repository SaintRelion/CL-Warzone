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

  const { useSelect: paymentHistorySelect, useInsert: paymentHistoryInsert } =
    useDBOperationsLocked<PaymentHistory>("PaymentHistory", false, false);
  const { data: paymentHistory } = paymentHistorySelect();

  const sortedPaymentHistory =
    paymentHistory != undefined && paymentHistory.length > 0
      ? paymentHistory.sort((a, b) => {
          const dateA = toDate(a.createdAt)?.getTime() ?? 0;
          const dateB = toDate(b.createdAt)?.getTime() ?? 0;

          // Sort descending (newest first)
          return dateB - dateA;
        })
      : [];

  const [showGcashModal, setShowGcashModal] = useState(false);

  const { useSelect: subscriptionSelect, useUpdate: subscriptionUpdate } =
    useDBOperationsLocked<Subscription>("Subscription", false, false);

  const { data: currentSubscriptions } = subscriptionSelect({
    firebaseOptions: {
      filterField: ["userId", "status"],
      value: [user.id, "Active"],
    },
  });

  const currentSubscription =
    currentSubscriptions != undefined && currentSubscriptions.length > 0
      ? currentSubscriptions[0]
      : null;
  let currentPlan: Plan | null = null;

  if (currentSubscription) {
    currentPlan = PLANS.filter((v) => v.id == currentSubscription.planId)[0];
  }

  async function handlePayment() {
    if (currentSubscription && currentPlan) {
      const balance = Number(currentSubscription.balance);
      if (balance <= 0) {
        alert("All balance paid");
        return;
      }

      const randomBetween = (min: number, max: number) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

      let randomAmount = randomBetween(100, 800);
      randomAmount = Math.min(randomAmount, balance);

      const remainingBalance = balance - randomAmount;
      const status = remainingBalance > 0 ? "pending" : "complete";

      const transaction = {
        userId: user.id,
        description: currentPlan.name,
        amount: randomAmount.toString(),
        status,
        invoice: `INV-${Date.now()}`,
      };

      await paymentHistoryInsert.run(transaction);
      await subscriptionUpdate.run({
        field: "id",
        value: currentSubscription.id,
        updates: { balance: remainingBalance.toString() },
      });

      toast.success(`PHP ${randomAmount}: recorded successfully.`);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
          Billing & Payments
        </h2>
        <p className="text-gray-600">
          Manage your subscription and payment methods
        </p>
      </div>

      {/* Next Due Date Card */}
      <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow-lg md:p-8">
        {currentSubscription && currentPlan ? (
          <>
            <h3 className="mb-4 text-2xl font-bold">Current Subscription</h3>
            <div className="mb-4 grid grid-cols-2 items-center rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div>
                <p className="mb-1 text-sm text-indigo-100">Plan</p>
                <p className="text-2xl font-bold">{currentPlan.name}</p>
              </div>

              <div>
                <p className="mb-1 text-sm text-indigo-100">Status</p>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-green-400"></span>
                  <p className="text-lg font-semibold">
                    {currentSubscription.status}
                  </p>
                </div>
              </div>
            </div>
            <h3 className="mb-4 text-2xl font-bold">Next Due Date</h3>
            <div className="flex items-center justify-between rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div>
                <p className="text-sm text-indigo-200">
                  Your next bill is due on
                </p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {formatReadableDate(currentSubscription.nextBillingDate)}
                </p>
              </div>

              <div className="rounded-lg bg-white/20 px-4 py-2 font-semibold text-white">
                ₱{currentSubscription.balance}
              </div>
            </div>
            {/* Pay Now Button */}
            <button
              onClick={() => handlePayment()}
              disabled={
                subscriptionUpdate.isLocked || paymentHistoryInsert.isLocked
              }
              className="mt-6 w-full rounded-lg bg-white px-6 py-2 font-semibold text-indigo-700 shadow transition hover:bg-indigo-100 md:w-auto"
            >
              Pay Now via oxygen
            </button>{" "}
            <button
              onClick={() => setShowGcashModal(true)}
              className="mt-6 w-full rounded-lg bg-white px-6 py-2 font-semibold text-indigo-700 shadow transition hover:bg-indigo-100 md:w-auto"
            >
              Pay Now via GCash
            </button>{" "}
          </>
        ) : (
          <h3 className="text-2xl font-bold">No Active Subscription</h3>
        )}
      </div>

      {/* GCash Modal */}
      {showGcashModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <h2 className="mb-2 text-xl font-bold text-indigo-700">
              GCash Payment
            </h2>
            <p className="mb-4 text-gray-600">
              Scan this QR using your GCash app
            </p>

            <img
              src="/gcash-qr.png"
              alt="GCash QR Code"
              className="mx-auto mb-4 w-56 rounded-lg shadow"
            />

            <div className="mb-6 text-left text-sm text-gray-700">
              <p className="mb-1 font-semibold text-indigo-700">How to pay:</p>
              <ol className="ml-5 list-decimal space-y-1">
                <li>Open the GCash app</li>
                <li>
                  Tap <strong>Pay QR</strong>
                </li>
                <li>
                  Select <strong>Upload QR</strong> or scan directly
                </li>
                <li>
                  Enter the exact amount: <strong>₱1,999</strong>
                </li>
                <li>Confirm payment</li>
              </ol>
            </div>

            <button
              onClick={() => setShowGcashModal(false)}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="rounded-xl bg-white p-6 shadow-md md:p-8">
        <h3 className="mb-6 text-2xl font-bold text-gray-900">
          Payment History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Description
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Amount
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPaymentHistory == undefined ||
              sortedPaymentHistory.length == 0 ? (
                <tr>
                  <td className="pt-4">No Payment history</td>
                </tr>
              ) : (
                sortedPaymentHistory.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 text-gray-900">
                      {formatReadableDateTime(payment.createdAt)}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {payment.description}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-900">
                      ₱{payment.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold capitalize ${
                          payment.status === "complete"
                            ? "bg-green-100 text-green-800"
                            : payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 md:text-sm">
                        Download
                      </button>
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

export default BillingAndPaymentsPage;
