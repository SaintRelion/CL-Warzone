import { useActivityLogger } from "@/lib/activity-logger";
import type { CreatePaymentHistory } from "@/models/PaymentHistory";
import { useBillingStore } from "@/stores/billing/useBillingStore";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import {
  formatReadableDate,
  formatReadableDateTime,
  getCurrentDateTimeString,
  toDate,
} from "@saintrelion/time-functions";
import { useState } from "react";

const ProcessPayment = () => {
  const { log } = useActivityLogger();

  const { useInsert: insertPaymentHistory } = useResourceLocked<
    never,
    CreatePaymentHistory
  >("paymenthistory");

  const cashierBehavior = useBillingStore((s) => s.cashierBehavior);
  const selectedBillingInfo = useBillingStore((s) => s.selectedBillingInfo);
  const printReceipt = useBillingStore((s) => s.printReceipt);
  const clearAll = useBillingStore((s) => s.clearAll);

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [transactionRef, setTransactionRef] = useState("");
  const [transactionScreenshot, setTransactionScreenshot] = useState("");
  const [amountReceived, setAmountReceived] = useState("");
  const [change, setChange] = useState(0);

  const handleScreenshotUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTransactionScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateChange = (received: string): void => {
    const amount = parseFloat(received) || 0;
    const due = parseInt(selectedBillingInfo?.amount ?? "0");
    setChange(Math.max(0, amount - due));
  };

  const completeCashPayment = async (): Promise<void> => {
    if (!selectedBillingInfo) return;

    const received = parseFloat(amountReceived) || 0;
    if (received >= parseInt(selectedBillingInfo.amount)) {
      const dueDate = toDate(selectedBillingInfo.due_date);

      if (dueDate) {
        const nextBillingDate = new Date(dueDate);
        nextBillingDate.setDate(nextBillingDate.getDate() + 30);

        const nextBillingReadable = formatReadableDate(
          nextBillingDate.toISOString().split("T")[0],
        );

        let changeAmount = 0;
        let creditAmount = 0;

        if (change > 0) {
          if (paymentMethod === "Cash") {
            changeAmount = change;
          } else {
            creditAmount = change;
          }
        }

        const completedPayment: CreatePaymentHistory = {
          bill: selectedBillingInfo.id,
          user: selectedBillingInfo.user,
          customer: selectedBillingInfo.customer,
          method: paymentMethod,
          amount: received.toString(),
          change: changeAmount.toString(),
          credit: creditAmount.toString(),
          transaction_screenshot: transactionScreenshot,
          transaction_ref: paymentMethod !== "Cash" ? transactionRef : "",
          next_billing_date: nextBillingDate.toISOString().split("T")[0],
          status: "completed",
        };

        const id = await insertPaymentHistory.run(completedPayment);

        await log({
          action: "create",
          category: "billing",
          description: `Processed GCash payment ₱${received} for ${selectedBillingInfo.customer} - Plan: ${selectedBillingInfo.plan.name}`,
          status: "success",
          additional_info: {
            amount: selectedBillingInfo.amount,
            payment_method: paymentMethod,
            plan_name: selectedBillingInfo.plan.name,
          },
        });

        clearAll();
        printReceipt(selectedBillingInfo, {
          id: id,
          bill: selectedBillingInfo.id,
          user: selectedBillingInfo.user,
          customer: selectedBillingInfo.customer,
          method: paymentMethod,
          amount: received.toString(),
          change: changeAmount.toString(),
          credit: creditAmount.toString(),
          transaction_screenshot: transactionScreenshot,
          transaction_ref: paymentMethod !== "Cash" ? transactionRef : "",
          created_at: formatReadableDateTime(getCurrentDateTimeString()),
          next_billing_date: nextBillingReadable,
          status: "completed",
          voided_at: "",
          voided_reason: "",
        });
      }
    } else {
      alert("Insufficient amount received!");
    }
  };

  if (!selectedBillingInfo || cashierBehavior != "payment") return <></>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3 text-3xl shadow-md">
              💵
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900">
                Cash Payment
              </h3>
              <p className="text-xs font-semibold text-gray-700">
                Process payment
              </p>
            </div>
          </div>
        </div>

        {/* Customer & Amount Info */}
        <div className="mb-6 space-y-3 rounded-lg bg-gray-50 p-4">
          <div className="flex justify-between">
            <span className="text-sm font-semibold text-gray-700">
              Customer:
            </span>
            <span className="font-black text-gray-900">
              {selectedBillingInfo.customer}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-semibold text-gray-700">
              Amount Due:
            </span>
            <span className="text-lg font-black text-indigo-600">
              ₱{selectedBillingInfo.amount}
            </span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-bold text-gray-800">
            Payment Method
          </label>
          <select
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="Cash">💵 Cash</option>
            <option value="GCash">📱 GCash</option>
            <option value="Maya">💳 Maya</option>
            <option value="Bank Transfer">🏦 Bank Transfer</option>
            <option value="Credit Card">💳 Credit Card</option>
            <option value="Debit Card">💳 Debit Card</option>
          </select>
        </div>

        {/* Transaction Reference - Only for non-cash payments */}
        {paymentMethod !== "Cash" && (
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-gray-800">
              Transaction Reference
            </label>
            <input
              type="text"
              onChange={(e) => setTransactionRef(e.target.value)}
              placeholder="e.g., TRX123456789 or GCash Ref No."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        )}

        {/* Transaction Screenshot - Optional for all payments */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-bold text-gray-800">
            Transaction Screenshot (Optional)
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleScreenshotUpload}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 text-center transition-colors hover:border-green-500 hover:bg-green-50">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-2 text-xs font-semibold text-gray-700">
                  {transactionScreenshot
                    ? "✓ Screenshot Added"
                    : "Click to upload screenshot"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Screenshot Preview */}
        {transactionScreenshot && (
          <div className="mb-6 rounded-lg border border-gray-200 p-3">
            <p className="mb-2 text-xs font-bold text-gray-700">
              Screenshot Preview:
            </p>
            <img
              src={transactionScreenshot}
              alt="Transaction Screenshot"
              className="max-h-40 w-full rounded object-cover"
            />
          </div>
        )}

        {/* Amount Received Input */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-800">
            Amount Received
          </label>
          <input
            type="number"
            value={amountReceived}
            onChange={(e) => {
              setAmountReceived(e.target.value);
              calculateChange(e.target.value);
            }}
            placeholder="0.00"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        {/* Change Display */}
        {amountReceived &&
          parseFloat(amountReceived) >=
            parseFloat(selectedBillingInfo.amount) && (
            <div className="mb-6 rounded-lg bg-green-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-green-800">
                  Change:
                </span>
                <span className="text-2xl font-black text-green-600">
                  ₱{change.toFixed(2)}
                </span>
              </div>
            </div>
          )}

        {/* Warning for insufficient amount */}
        {amountReceived &&
          parseFloat(amountReceived) <
            parseFloat(selectedBillingInfo.amount) && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-800">
              ⚠️ Insufficient amount. Need ₱
              {(
                parseFloat(selectedBillingInfo.amount) -
                parseFloat(amountReceived)
              ).toFixed(2)}{" "}
              more.
            </div>
          )}

        {/* Quick Amount Buttons */}
        <div className="mb-6">
          <p className="mb-2 text-xs font-bold text-gray-700">Quick amounts:</p>
          <div className="grid grid-cols-4 gap-2">
            {[100, 200, 500, 1000].map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  const newAmount = (parseFloat(amountReceived) || 0) + amt;
                  setAmountReceived(newAmount.toString());
                  calculateChange(newAmount.toString());
                }}
                className="rounded border border-gray-300 px-2 py-2 text-sm font-medium hover:bg-gray-50"
              >
                +₱{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              clearAll();
              setAmountReceived("");
              setChange(0);
              setPaymentMethod("Cash");
              setTransactionRef("");
              setTransactionScreenshot("");
            }}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 active:scale-95"
          >
            ✕ Cancel
          </button>
          <button
            onClick={completeCashPayment}
            disabled={
              insertPaymentHistory.isLocked ||
              !amountReceived ||
              parseFloat(amountReceived) < parseInt(selectedBillingInfo.amount)
            }
            className="flex-1 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-green-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            ✓ Complete Payment
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProcessPayment;
