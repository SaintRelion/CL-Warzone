import type { PaymentHistory } from "@/models/payment-history";
import type { PaymentMethod } from "@/models/payment-method";
import type { Subscription } from "@/models/subscription";
import { useState } from "react";

const BillingAndPaymentsPage = () => {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([
    {
      id: "1",
      userId: "2",
      createdAt: "2024-11-01",
      amount: "1999",
      status: "paid",
      invoice: "INV-2024-11",
      description: "Fiber 500 Mbps - Monthly",
    },
    {
      id: "2",
      userId: "2",
      createdAt: "2024-10-01",
      amount: "1999",
      status: "paid",
      invoice: "INV-2024-10",
      description: "Fiber 500 Mbps - Monthly",
    },
  ]);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 1,
      type: "GCASH",
      number: "092834242",
      expiry: "N/A",
      isDefault: true,
    },
  ];

  const currentSubscription: Subscription = null;

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
      {/* id: string;
  userId: string;
  planId: string;
  balance: string;
  address: string;
  status: string;
  nextBillingDate: string; */}
      {/* Current Subscription */}


      {/* Next Due Date Card */}
{/* Next Due Date Card (Gradient) */}
<div className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 shadow-lg text-white md:p-8">
  <h3 className="mb-4 text-2xl font-bold">Next Due Date</h3>

  <div className="flex items-center justify-between rounded-lg bg-white/10 backdrop-blur-sm p-4">
    <div>
      <p className="text-sm text-indigo-200">Your next bill is due on</p>

      {/* DISPLAY NEXT DUE DATE HERE */}
      <p className="mt-1 text-2xl font-bold text-white">
        December 28, 2024
      </p>
    </div>

    <div className="rounded-lg bg-white/20 px-4 py-2 text-white font-semibold">
      ₱1,999
    </div>
  </div>
</div>


      <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow-lg md:p-8">
        {currentSubscription ? (
          <>
            <h3 className="mb-4 text-2xl font-bold">Current Subscription</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p className="mb-1 text-sm text-indigo-100">Plan</p>
                <p className="text-2xl font-bold">
                  {currentSubscription.planId}
                </p>
              </div>
              <div>
                <p className="mb-1 text-sm text-indigo-100">Monthly Fee</p>
                <p className="text-2xl font-bold">₱{1000}</p>
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
              <div>
                <p className="mb-1 text-sm text-indigo-100">
                  Next Billing Date
                </p>
                <p className="text-lg font-semibold">
                  {currentSubscription.nextBillingDate}
                </p>
              </div>
            </div>{" "}
          </>
        ) : (
          <h3 className="text-2xl font-bold">No Active Subscription</h3>
        )}
      </div>

      <div className="rounded-xl bg-white p-6 shadow-md md:p-8">
        <h3 className="mb-6 text-2xl font-bold text-gray-900">
          Payment Methods
        </h3>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-indigo-100 p-3">
                  <span className="text-2xl">💳</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {method.type} {method.number}
                  </p>
                  <p className="text-sm text-gray-600">
                    Expires {method.expiry}
                  </p>
                </div>
              </div>
              {method.isDefault && (
                <span className="rounded bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                  DEFAULT
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
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
              {paymentHistory.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-4 text-gray-900">
                    {payment.createdAt}
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
                        payment.status === "paid"
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default BillingAndPaymentsPage;
