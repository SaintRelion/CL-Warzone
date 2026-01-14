import { DataTable } from "@/components/admin/DataTable";
import type { ClientTicket } from "@/models/Tickets";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import type { ColumnDef } from "@tanstack/react-table";

const TicketsPage = () => {
  const { useList: getTickets } = useResourceLocked<ClientTicket>("tickets");
  const tickets = getTickets().data;

  const ticketsColumns: ColumnDef<ClientTicket>[] = [
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

  return tickets ? (
    <DataTable type="tickets" data={tickets} columns={ticketsColumns} />
  ) : (
    <div>No Tickets</div>
  );
};
export default TicketsPage;
