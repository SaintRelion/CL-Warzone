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

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("low");
  const [newDescription, setNewDescription] = useState("");

  const createTicket = () => {
    if (!newTitle || !newDescription) return alert("Fill all fields!");

    const newTicket: SupportTicket = {
      id: supportTickets.length + 1,
      title: newTitle,
      status: "open",
      date: new Date().toISOString().split("T")[0],
      priority: newPriority,
      description: newDescription,
    };

    setSupportTickets([...supportTickets, newTicket]);

    // clear form
    setNewTitle("");
    setNewPriority("low");
    setNewDescription("");
  };

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
    <div className="space-y-10">
      <div>
        <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
          Support Tickets
        </h2>
        <p className="text-gray-600">Track and manage your support requests</p>
      </div>

      {/* CREATE TICKET FORM */}
      <div className="rounded-xl bg-white p-6 shadow-md space-y-4">
        <h3 className="text-xl font-semibold">Create New Ticket</h3>

        <input
          type="text"
          placeholder="Enter Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>

        <textarea
          placeholder="Describe the issue"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="w-full p-2 border rounded"
        ></textarea>

        <button
          onClick={createTicket}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Submit Ticket
        </button>
      </div>

      {/* TICKETS LIST */}
      <div className="space-y-4">
        {supportTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="rounded-xl bg-white p-6 shadow-md hover:shadow-lg"
          >
            <div className="flex flex-col gap-4 md:flex-row md:justify-between">
              <div>
                <h3 className="text-xl font-bold">{ticket.title}</h3>
                <p className="text-gray-600 mb-3">{ticket.description}</p>

                <div className="flex flex-wrap gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getTicketStatusColor(
                      ticket.status
                    )}`}
                  >
                    {ticket.status.toUpperCase()}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityColor(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority.toUpperCase()} PRIORITY
                  </span>

                  <span className="text-sm text-gray-600">
                    Created: {ticket.date}
                  </span>
                </div>
              </div>

              <button className="text-indigo-600 font-medium hover:text-indigo-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {supportTickets.length === 0 && (
        <div className="rounded-xl bg-gray-50 p-8 text-center text-gray-600">
          You don't have any support tickets yet.
        </div>
      )}
    </div>
  );
};

export default SupportTicketsPage;
