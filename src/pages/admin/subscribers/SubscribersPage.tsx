import { DataTable } from "@/components/admin/DataTable";
import type { Subscription } from "@/models/subscription";
import type { User } from "@/models/user";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import type { ColumnDef } from "@tanstack/react-table";

const SubscribersPage = () => {
  // const { useSelect: usersSelect } = useDBOperationsLocked<User>("User");
  // const { data: users } = usersSelect();

  // const { useSelect: subscriptionsSelect } =
  //   useDBOperationsLocked<Subscription>("Subscription");
  // const { data: subscriptions } = subscriptionsSelect();

  const mockSubscriptions = [
    {
      id: 1,
      userId: "1",
      planId: "2",
      balance: "500",
      address: "Katipunan",
      status: "Active",
      nextBillingDate: "October 2, 2025",
    },
    {
      id: 2,
      userId: "2",
      planId: "2",
      balance: "5000",
      address: "Katipunan",
      status: "Active",
      nextBillingDate: "October 5, 2025",
    },
    {
      id: 3,
      userId: "3",
      planId: "5",
      balance: "500",
      address: "Katipunan",
      status: "Active",
      nextBillingDate: "October 90, 2025",
    },
  ];

  const subscriptionColumns: ColumnDef<(typeof mockSubscriptions)[number]>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "userId",
      header: "User ID",
    },
    {
      accessorKey: "planId",
      header: "Plan ID",
    },
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
      cell: ({ getValue }) => <>₱{getValue<string>()}</>,
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "nextBillingDate",
      header: "Next Billing",
    },
  ];

  return (
    <DataTable
      type="mockSubscriptions"
      data={mockSubscriptions}
      columns={subscriptionColumns}
    />
  );
};
export default SubscribersPage;
