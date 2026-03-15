import type { SupportTicket } from "@/models/SupportTicket";
import {
  type Paginated,
  useResourceLocked,
} from "@saintrelion/data-access-layer";
import KPICards from "@/components/support-tickets/KPICards";
import TicketsTable from "@/components/support-tickets/TicketsTable";
import ViewTicket from "@/components/support-tickets/ViewTicket";

const AdminSupportTicketsPage = () => {
  const { useList: getTickets } =
    useResourceLocked<Paginated<SupportTicket>>("supportticket");
  const tickets = getTickets({ filters: { nopage: true } }).data;

  if (!tickets) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-gray-900">
          Support Tickets
        </h1>
        <p className="text-sm text-gray-500">
          Manage and respond to customer support requests
        </p>
      </div> */}

      {/* Stats Cards */}
      <KPICards tickets={tickets.results} />

      {/* Tickets Table */}
      <TicketsTable tickets={tickets.results} />

      {/* View Ticket Modal */}
      <ViewTicket />
    </div>
  );
};
export default AdminSupportTicketsPage;
