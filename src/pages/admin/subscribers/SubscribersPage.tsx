import { DataTable } from "@/components/admin/DataTable";
import type { Subscription } from "@/models/subscription";
import type { User } from "@/models/user";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import type { ColumnDef } from "@tanstack/react-table";

const SubscribersPage = () => {
  const { useSelect: usersSelect } = useDBOperationsLocked<User>("User");
  const { data: users } = usersSelect();

  const { useSelect: subscribersSelect } =
    useDBOperationsLocked<Subscription>("Subscribers");
  const { data: subscribers } = subscribersSelect();

  const subscriberColumns: ColumnDef<typeof subscribers>[] = [
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
    <span>sdf</span>
    // <DataTable
    //   type="subscribers"
    //   data={subscribers}
    //   columns={subscriberColumns}
    // />
  );
};
export default SubscribersPage;
