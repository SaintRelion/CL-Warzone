import { useTicketStore } from "@/stores/tickets/useTicketStore";
import { X } from "lucide-react";
import { getPriorityColor, getStatusColor, getStatusIcon } from "./helpers";
import type { UpdateTicket } from "@/models/SupportTicket";
import { useResourceLocked } from "@saintrelion/data-access-layer";

const ViewTicket = () => {
  const selectedTicket = useTicketStore((s) => s.selectedTicket);
  const viewTicket = useTicketStore((s) => s.viewTicket);

  const { useUpdate: updateTicket } = useResourceLocked<
    never,
    never,
    UpdateTicket
  >("supportticket");

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      await updateTicket.run({ id: ticketId, payload: { status: newStatus } });
      viewTicket(null);
    } catch (error) {
      console.error("Failed to update ticket status:", error);
    }
  };

  if (!selectedTicket) return <></>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-2xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Ticket Details
          </h2>
          <button
            onClick={() => viewTicket(null)}
            className="rounded p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Customer
              </label>
              <p className="text-gray-900">{selectedTicket.customer}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Status
              </label>
              <p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(selectedTicket.status)}`}
                >
                  {getStatusIcon(selectedTicket.status)}
                  {selectedTicket.status}
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Priority
              </label>
              <p>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPriorityColor(selectedTicket.priority)}`}
                >
                  {selectedTicket.priority}
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Assigned To
              </label>
              <p className="text-gray-900">
                {selectedTicket.assigned_to || "Unassigned"}
              </p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Issue</label>
            <p className="text-gray-900">{selectedTicket.issue}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Description
            </label>
            <p className="whitespace-pre-wrap text-gray-900">
              {selectedTicket.description}
            </p>
          </div>

          {/* Quick Status Update */}
          <div className="border-t pt-4">
            <label className="text-sm font-medium text-gray-500">
              Update Status
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {["open", "in_progress", "resolved", "closed"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    handleUpdateStatus(selectedTicket.id, status);
                    viewTicket(selectedTicket);
                  }}
                  disabled={
                    selectedTicket.status === status || updateTicket.isLocked
                  }
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    selectedTicket.status === status
                      ? "cursor-not-allowed bg-gray-200 text-gray-500"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={() => viewTicket(null)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default ViewTicket;
