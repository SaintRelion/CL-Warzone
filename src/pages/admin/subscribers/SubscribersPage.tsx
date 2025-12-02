import { DataTable } from "@/components/admin/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

const SubscribersPage = () => {
  const subscribers = [
    {
      id: 1,
      name: "Juan dela Cruz",
      plan: "100 Mbps",
      status: "Active",
      balance: 0,
      address: "Brgy. San Jose",
    },
    {
      id: 2,
      name: "Maria Santos",
      plan: "50 Mbps",
      status: "Active",
      balance: 1200,
      address: "Brgy. Poblacion",
    },
    {
      id: 3,
      name: "Pedro Reyes",
      plan: "200 Mbps",
      status: "Suspended",
      balance: 2400,
      address: "Brgy. Fatima",
    },
  ];

  const subscriberColumns: ColumnDef<(typeof subscribers)[number]>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "plan", header: "Plan" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const val = getValue<string>();
        const color =
          val === "Active"
            ? "bg-green-100 text-green-800"
            : val === "Suspended"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800";
        return (
          <span className={`rounded px-2 py-1 text-xs font-semibold ${color}`}>
            {val}
          </span>
        );
      },
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ getValue }) => <>₱{getValue<number>()}</>,
    },
    { accessorKey: "address", header: "Address" },
  ];

  return (
    <DataTable
      type="subscribers"
      data={subscribers}
      columns={subscriberColumns}
    />
  );
};
export default SubscribersPage;
