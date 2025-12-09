import { DataTable } from "@/components/admin/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

// Function to compute next due date
const getNextDueDate = (dateString: string) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 30); // add 30 days
  return date.toISOString().split("T")[0]; // format YYYY-MM-DD
};

const BillingPage = () => {
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

  const paymentColumns: ColumnDef<(typeof payments)[number]>[] = [
    { accessorKey: "customer", header: "Customer" },

    // Amount
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ getValue }) => <>₱{getValue<number>()}</>,
    },

    { accessorKey: "method", header: "Method" },

    // Payment Date
    { accessorKey: "date", header: "Payment Date" },

    // 🔥 NEW COLUMN: Next Due Date
    {
      accessorKey: "nextDueDate",
      header: "Next Due Date",
      cell: ({ getValue }) => {
        const due = getValue<string>();
        return <span className="font-medium text-indigo-600">{due}</span>;
      },
    },

    // Status Pill
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const val = getValue<string>();
        const color =
          val === "Completed"
            ? "bg-green-100 text-green-800"
            : val === "Pending"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800";

        return (
          <span className={`rounded px-2 py-1 text-xs font-semibold ${color}`}>
            {val}
          </span>
        );
      },
    },
  ];

  return <DataTable type="payments" data={payments} columns={paymentColumns} />;
};

export default BillingPage;
