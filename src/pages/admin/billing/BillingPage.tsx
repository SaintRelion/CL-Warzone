import { useState, useRef } from "react";
import { DataTable } from "@/components/admin/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

// Compute next due date
const getNextDueDate = (dateString: string) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 30);
  return date.toISOString().split("T")[0];
};

const BillingPage = () => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);

  const payments = [
    {
      id: 1,
      customer: "Juan dela Cruz",
      amount: 1500,
      method: "GCash",
      date: "2024-11-28",
      status: "Completed",
      nextDueDate: getNextDueDate("2024-11-28"),
    },
    {
      id: 2,
      customer: "Maria Santos",
      amount: 999,
      method: "Bank Transfer",
      date: "2024-11-27",
      status: "Completed",
      nextDueDate: getNextDueDate("2024-11-27"),
    },
    {
      id: 3,
      customer: "Pedro Reyes",
      amount: 1899,
      method: "Cash",
      date: "2024-11-25",
      status: "Pending",
      nextDueDate: getNextDueDate("2024-11-25"),
    },
  ];

  const printReceipt = () => {
    if (!receiptRef.current) return;

    const content = receiptRef.current.innerHTML;
    const win = window.open("", "", "width=400,height=600");
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .divider { border-top: 1px dashed #000; margin: 12px 0; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  const paymentColumns: ColumnDef<(typeof payments)[number]>[] = [
    { accessorKey: "customer", header: "Customer" },

    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ getValue }) => <>₱{getValue<number>()}</>,
    },

    { accessorKey: "method", header: "Method" },
    { accessorKey: "date", header: "Payment Date" },

    {
      accessorKey: "nextDueDate",
      header: "Next Due Date",
      cell: ({ getValue }) => (
        <span className="font-medium text-indigo-600">
          {getValue<string>()}
        </span>
      ),
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const val = getValue<string>();
        const color =
          val === "Completed"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800";

        return (
          <span className={`rounded px-2 py-1 text-xs font-semibold ${color}`}>
            {val}
          </span>
        );
      },
    },

    {
      header: "Action",
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedPayment(row.original)}
          className="rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
        >
          Print Receipt
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        Cashiering & Billing
      </h2>

      <DataTable type="payments" data={payments} columns={paymentColumns} />

     {/* ===================== RECEIPT PREVIEW ===================== */}
{selectedPayment && (
  <div className="rounded-xl border bg-white p-6 shadow">
    <div ref={receiptRef} className="mx-auto max-w-md">
      {/* HEADER */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
          💳
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          Payment Receipt
        </h2>
      </div>

      {/* PLAN INFO */}
      <div className="mb-6 rounded-xl border bg-gray-50 p-4">
        <div className="flex items-center gap-2">
          <span className="text-indigo-600">📶</span>
          <div>
            <div className="font-semibold text-gray-900">
              Internet Subscription
            </div>
            <div className="text-sm text-gray-500">
              Monthly Plan • Unlimited Data
            </div>
          </div>
        </div>
      </div>

      {/* BREAKDOWN */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Amount Paid</span>
          <span className="font-medium">
            ₱{selectedPayment.amount}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Payment Method</span>
          <span className="font-medium">
            {selectedPayment.method}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Payment Date</span>
          <span className="font-medium">
            {selectedPayment.date}
          </span>
        </div>

        <hr />

        <div className="flex justify-between font-semibold">
          <span>Next Billing Date</span>
          <span className="text-indigo-600">
            {selectedPayment.nextDueDate}
          </span>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="mt-6 space-y-2 text-xs text-gray-500">
        <div>👤 Customer: {selectedPayment.customer}</div>
        <div>🧾 Receipt No: OR-{selectedPayment.id.toString().padStart(6, "0")}</div>
        <div>🔁 Billing Cycle: Monthly</div>
        <div>📍 Service Area: Metro Manila</div>
      </div>

      {/* THANK YOU */}
      <div className="mt-6 text-center text-sm text-gray-600">
        Thank you for your payment.
      </div>
    </div>

    {/* ACTION BUTTONS */}
    <div className="mt-6 flex justify-end gap-3">
      <button
        onClick={() => setSelectedPayment(null)}
        className="rounded border px-4 py-2 text-sm"
      >
        Close
      </button>

      <button
        onClick={printReceipt}
        className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
      >
        Print Receipt
      </button>
    </div>
  </div>
)}
    </div>
  );
}

export default BillingPage;
