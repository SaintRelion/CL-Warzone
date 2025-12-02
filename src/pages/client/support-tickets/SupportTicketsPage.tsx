import { useState } from "react";

interface SupportTicket {
  id: number;
  title: string;
  status: string;
  date: string;
  priority: string;
  description: string;
}

const SupportTicketsPage = () => {
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: 1,
      title: "Slow internet speed",
      status: "open",
      date: "2024-11-25",
      priority: "high",
      description: "Experiencing slower speeds than expected",
    },
  ]);

  const getTicketStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";
      case "resolved":
        return "bg-blue-100 text-blue-700";
      case "closed":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
      case "low":
        return "bg-blue-100 text-blue-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "high":
        return "bg-red-100 text-red-700";
      case "urgent":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
          Support Tickets
        </h2>
        <p className="text-gray-600">Track and manage your support requests</p>
      </div>

      <div className="space-y-4">
        {supportTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg md:p-8"
          >
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {ticket.title}
                </h3>
                <p className="mb-4 text-gray-600">{ticket.description}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getTicketStatusColor(ticket.status)}`}
                  >
                    {ticket.status.replace("-", " ").toUpperCase()}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityColor(ticket.priority)}`}
                  >
                    {ticket.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className="text-sm text-gray-600">
                    Created: {ticket.date}
                  </span>
                </div>
              </div>
              <button className="text-sm font-medium whitespace-nowrap text-indigo-600 hover:text-indigo-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {supportTickets.length === 0 && (
        <div className="rounded-xl bg-gray-50 p-8 text-center">
          <p className="text-gray-600">
            You don't have any support tickets yet.
          </p>
        </div>
      )}
    </div>
  );
};
export default SupportTicketsPage;
