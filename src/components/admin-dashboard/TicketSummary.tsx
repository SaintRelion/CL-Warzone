import type { SupportTicket } from "@/models/SupportTicket";
import { AlertCircle, Activity } from "lucide-react";

const TicketSummary = ({ tickets }: { tickets: SupportTicket[] }) => {
  const totalTickets = tickets?.length || 0;
  const openTickets =
    tickets?.filter((t) => t.status !== "resolved" && t.status !== "closed")
      .length || 0;

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-700 uppercase">
        Tickets Summary
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
          <div>
            <p className="text-sm text-gray-600">Total Tickets</p>
            <p className="text-2xl font-bold text-gray-900">{totalTickets}</p>
          </div>
          <Activity className="h-8 w-8 text-blue-500" />
        </div>

        <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-4">
          <div>
            <p className="text-sm text-gray-600">Open Tickets</p>
            <p className="text-2xl font-bold text-gray-900">{openTickets}</p>
          </div>
          <AlertCircle className="h-8 w-8 text-yellow-500" />
        </div>

        <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
          <div>
            <p className="text-sm text-gray-600">Resolved Tickets</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalTickets - openTickets}
            </p>
          </div>
          <Activity className="h-8 w-8 text-green-500" />
        </div>
      </div>
    </div>
  );
};
export default TicketSummary;
