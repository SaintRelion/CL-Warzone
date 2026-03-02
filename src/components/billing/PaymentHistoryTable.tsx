import type {
  PaymentHistory,
  VoidPaymentHistory,
} from "@/models/PaymentHistory";
import {
  formatReadableDateTime,
  sortByTime,
} from "@saintrelion/time-functions";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../general/DataTable";
import { useBillingStore } from "@/stores/billing/useBillingStore";
import { toast } from "@saintrelion/notifications";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { useActivityLogger } from "@/lib/activity-logger";

const PaymentHistoryTable = ({
  paymentHistories,
}: {
  paymentHistories: PaymentHistory[];
}) => {
  const cashierBehavior = useBillingStore((s) => s.cashierBehavior);
  const selectedBillingInfo = useBillingStore((s) => s.selectedBillingInfo);
  const processPayment = useBillingStore((s) => s.processPayment);
  const clearAll = useBillingStore((s) => s.clearAll);

  const { log } = useActivityLogger();
  const { useUpdate: updatePaymentHistory } = useResourceLocked<
    never,
    never,
    VoidPaymentHistory
  >("paymenthistory", { showToast: false });

  if (!selectedBillingInfo || cashierBehavior != "paymenthistory") return <></>;

  const userPaymentHistories = sortByTime(
    paymentHistories.filter(
      (p) =>
        p.user == selectedBillingInfo.user && p.bill == selectedBillingInfo.id,
    ),
    "created_at",
  );

  const handleVoid = async (payment: PaymentHistory) => {
    const reason = prompt("Reason for voiding this payment?");
    if (!reason) return;

    updatePaymentHistory.run({
      id: payment.id,
      payload: {
        status: "voided",
        voided_at: new Date().toISOString(),
        voided_reason: reason,
      },
    });

    await log({
      action: "update",
      category: "billing",
      description: `Voided Payment Id: ${payment.id} for ${selectedBillingInfo.customer}`,
      status: "success",
      additional_info: {
        amount: selectedBillingInfo.amount,
        planName: selectedBillingInfo.plan.name,
      },
    });

    toast.success("Payment voided");
    processPayment(selectedBillingInfo);
  };

  const paymentHistoryColumns: ColumnDef<PaymentHistory>[] = [
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ getValue }) => (
        <span className="font-semibold">
          {formatReadableDateTime(getValue<string>())}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ getValue }) => (
        <span className="font-bold text-gray-900">₱{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "method",
      header: "Method",
      cell: ({ getValue }) => (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
          {getValue<string>()}
        </span>
      ),
    },
    {
      id: "excess",
      header: "Excess",
      accessorFn: (row) => {
        if (parseFloat(row.change) > 0) return row.change;
        if (parseFloat(row.credit) > 0) return row.credit;
        return 0;
      },
      cell: ({ row, getValue }) => {
        const value = getValue<number>();
        const isChange = parseFloat(row.original.change) > 0;

        if (!value) return "-";

        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              isChange
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {isChange ? "Change: " : "Credit: "}₱{value.toLocaleString()}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const val = getValue<string>();

        const isCompleted = val === "completed";

        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ${
              isCompleted
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isCompleted ? "✓ Completed" : "✕ Voided"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const payment = row.original;

        if (payment.status === "voided") return null;

        return (
          <button
            onClick={() => handleVoid(payment)}
            className="text-xs font-semibold text-red-600 hover:underline"
          >
            Void
          </button>
        );
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-5xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <div>
            <h3 className="text-2xl font-black text-gray-900">
              📋 Payment History
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Customer:{" "}
              <span className="font-bold">{selectedBillingInfo.customer}</span>
            </p>
          </div>
          <button
            onClick={() => clearAll()}
            className="rounded-lg bg-gray-100 px-3 py-1 text-lg font-bold text-gray-600 transition-colors hover:bg-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Payment History Table */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-lg">
          <DataTable
            data={userPaymentHistories}
            columns={paymentHistoryColumns}
            showDefaultActions={false}
            getRowId={(row) => row.id}
          />
        </div>

        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-1 gap-3 rounded-lg bg-gray-50 p-4">
          <div className="text-center">
            <p className="text-xs font-bold text-gray-600 uppercase">
              Total Paid
            </p>
            <p className="mt-1 text-2xl font-black text-green-600">
              ₱
              {paymentHistories
                .filter(
                  (p) =>
                    p.user === selectedBillingInfo.user &&
                    p.bill == selectedBillingInfo.id &&
                    p.status === "completed",
                )
                .reduce((sum, p) => sum + parseInt(p.amount), 0)
                .toLocaleString()}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => clearAll()}
          className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-700 active:scale-95"
        >
          ✓ Close
        </button>
      </div>
    </div>
  );
};
export default PaymentHistoryTable;
