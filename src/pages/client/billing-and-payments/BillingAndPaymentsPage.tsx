import { useState } from "react";

interface Subscription {
  plan: string;
  price: number;
  status: string;
  nextBillingDate: string;
}

interface PaymentHistory {
  id: number;
  date: string;
  amount: number;
  status: string;
  invoice: string;
  description: string;
}

interface PaymentMethod {
  id: number;
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

const BillingAndPaymentsPage = () => {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([
    {
      id: 1,
      date: "2024-11-01",
      amount: 1999,
      status: "paid",
      invoice: "INV-2024-11",
      description: "Fiber 500 Mbps - Monthly",
    },
    {
      id: 2,
      date: "2024-10-01",
      amount: 1999,
      status: "paid",
      invoice: "INV-2024-10",
      description: "Fiber 500 Mbps - Monthly",
    },
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 1, type: "Visa", last4: "4242", expiry: "12/25", isDefault: true },
  ]);

  const [currentSubscription, setCurrentSubscription] = useState<Subscription>({
    plan: "Fiber 500 Mbps",
    price: 1999,
    status: "Active",
    nextBillingDate: "2024-12-30",
  });

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

      {/* Current Subscription */}
      <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow-lg md:p-8">
        <h3 className="mb-4 text-2xl font-bold">Current Subscription</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm text-indigo-100">Plan</p>
            <p className="text-2xl font-bold">{currentSubscription.plan}</p>
          </div>
          <div>
            <p className="mb-1 text-sm text-indigo-100">Monthly Fee</p>
            <p className="text-2xl font-bold">
              ₱{currentSubscription.price.toLocaleString()}
            </p>
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
            <p className="mb-1 text-sm text-indigo-100">Next Billing Date</p>
            <p className="text-lg font-semibold">
              {currentSubscription.nextBillingDate}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
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
                    {method.type} •••• {method.last4}
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
                  <td className="px-4 py-4 text-gray-900">{payment.date}</td>
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
