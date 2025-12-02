import { DataTable } from "@/components/admin/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

const BillingPage = () => {
  const payments = [
    {
      id: 1,
      customer: "Juan dela Cruz",
      amount: 1500,
      method: "GCash",
      date: "2024-11-28",
      status: "Completed",
    },
    {
      id: 2,
      customer: "Maria Santos",
      amount: 999,
      method: "Bank Transfer",
      date: "2024-11-27",
      status: "Completed",
    },
    {
      id: 3,
      customer: "Pedro Reyes",
      amount: 1899,
      method: "Cash",
      date: "2024-11-25",
      status: "Pending",
    },
  ];

  const paymentColumns: ColumnDef<(typeof payments)[number]>[] = [
    { accessorKey: "customer", header: "Customer" },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ getValue }) => <>₱{getValue<number>()}</>,
    },
    { accessorKey: "method", header: "Method" },
    { accessorKey: "date", header: "Date" },
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
