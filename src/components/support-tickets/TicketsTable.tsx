import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../general/DataTable";
import type { SupportTicket, UpdateTicket } from "@/models/SupportTicket";
import { CheckCircle, Eye, Filter, Search } from "lucide-react";
import {
  useTicketStore,
  type TicketFilter,
  type TicketPriorityFilter,
} from "@/stores/tickets/useTicketStore";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { getPriorityColor, getStatusColor, getStatusIcon } from "./helpers";

const TicketsTable = ({ tickets }: { tickets: SupportTicket[] }) => {
  const viewTicket = useTicketStore((s) => s.viewTicket);

  const searchTerm = useTicketStore((s) => s.searchTerm);
  const setSearchTerm = useTicketStore((s) => s.setSearchTerm);

  const ticketFilter = useTicketStore((s) => s.ticketFilter);
  const setTicketFilter = useTicketStore((s) => s.setTicketFilter);

  const ticketPriorityFilter = useTicketStore((s) => s.ticketPriorityFilter);
  const setTicketPriorityFilter = useTicketStore(
    (s) => s.setTicketPriorityFilter,
  );

  const { useUpdate: updateTicket } = useResourceLocked<
    never,
    never,
    UpdateTicket
  >("supportticket");

  // Filter tickets
  const priorityOrder: Record<string, number> = {
    urgent: 0,
    high: 1,
    medium: 2,
    low: 3, // Assuming "slow" maps to "low" or "slow"
  };

  const filteredTickets = tickets
    .filter((ticket) => {
      const matchesSearch =
        ticket.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.issue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        ticketFilter === "all" || ticket.status === ticketFilter;
      const matchesPriority =
        ticketPriorityFilter === "all" ||
        ticket.priority === ticketPriorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      const weightA = priorityOrder[a.priority.toLowerCase()] ?? 99;
      const weightB = priorityOrder[b.priority.toLowerCase()] ?? 99;
      return weightA - weightB;
    });

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      await updateTicket.run({ id: ticketId, payload: { status: newStatus } });
    } catch (error) {
      console.error("Failed to update ticket status:", error);
    }
  };

  const ticketColumns: ColumnDef<SupportTicket>[] = [
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ getValue }) => (
        <span className="font-medium text-gray-900">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "issue",
      header: "Issue",
      cell: ({ row }) => {
        const ticket = row.original;

        return (
          <div>
            <div className="max-w-xs truncate text-sm text-gray-900">
              {ticket.issue}
            </div>
            <div className="max-w-xs truncate text-xs text-gray-500">
              {ticket.description}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ getValue }) => {
        const priority = getValue<string>();

        return (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPriorityColor(
              priority,
            )}`}
          >
            {priority}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const ticket = row.original;

        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
              ticket.status,
            )}`}
          >
            {getStatusIcon(ticket.status)}
            {ticket.status}
          </span>
        );
      },
    },
    {
      accessorKey: "assigned_to",
      header: "Assigned To",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-500">
          {getValue<string>() || "-"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const ticket = row.original;

        return (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => viewTicket(ticket)}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </button>

            {ticket.status !== "resolved" && ticket.status !== "closed" && (
              <button
                onClick={() => handleUpdateStatus(ticket.id, "resolved")}
                disabled={updateTicket.isLocked}
                className="rounded p-1 text-green-400 hover:bg-green-50 hover:text-green-600 disabled:opacity-50"
                title="Mark as Resolved"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      {/* FILTERS AND SEARCH - MINIMALIST */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-white p-4 shadow-sm">
        <div className="relative min-w-50 flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex w-full items-center gap-2 max-md:flex-col">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={ticketFilter}
            onChange={(e) => setTicketFilter(e.target.value as TicketFilter)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={ticketPriorityFilter}
            onChange={(e) =>
              setTicketPriorityFilter(e.target.value as TicketPriorityFilter)
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        {filteredTickets.length > 0 ? (
          <DataTable
            data={filteredTickets}
            columns={ticketColumns}
            showDefaultActions={false}
            getRowId={(row) => row.id}
          />
        ) : (
          <div className="rounded-xl border bg-white py-12 text-center text-gray-500 shadow-lg">
            No tickets found
          </div>
        )}
      </div>
    </>
  );
};
export default TicketsTable;
