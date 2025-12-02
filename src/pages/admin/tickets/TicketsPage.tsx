import { DataTable } from "@/components/admin/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

const TicketsPage = () => {
  const tickets = [
    {
      id: 1,
      customer: "Juan dela Cruz",
      issue: "No Connection",
      priority: "Critical",
      status: "Open",
      assignedTo: "Tech-01",
    },
    {
      id: 2,
      customer: "Maria Santos",
      issue: "Slow Browsing",
      priority: "High",
      status: "In Progress",
      assignedTo: "Tech-02",
    },
    {
      id: 3,
      customer: "Pedro Reyes",
      issue: "Billing Issue",
      priority: "Medium",
      status: "Open",
      assignedTo: "Tech-03",
    },
  ];

  const ticketsColumns: ColumnDef<(typeof tickets)[number]>[] = [
    { accessorKey: "customer", header: "Customer" },
    { accessorKey: "issue", header: "Issue" },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ getValue }) => {
        const val = getValue<string>();
        const color =
          val === "Critical"
            ? "bg-red-100 text-red-800"
            : val === "High"
              ? "bg-orange-100 text-orange-800"
              : val === "Medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800";
        return (
          <span className={`rounded px-2 py-1 text-xs font-semibold ${color}`}>
            {val}
          </span>
        );
      },
    },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "assignedTo", header: "Assigned To" },
  ];

  return <DataTable type="tickets" data={tickets} columns={ticketsColumns} />;
};
export default TicketsPage;
