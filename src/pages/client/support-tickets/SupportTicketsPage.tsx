import { useState } from "react";

interface SupportTicket {
  id: number;
  issueType: string;
  service: string;
  status: string;
  priority: string;
  date: string;
  description: string;
}

const SupportTicketsPage = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 1,
      issueType: "Slow Internet Speed",
      service: "Home Fiber",
      status: "open",
      priority: "high",
      date: "2024-11-25",
      description:
        "Internet speed drops significantly during peak hours. Unable to stream or attend meetings.",
    },
  ]);

  /* ===================== FORM STATE ===================== */
  const [issueType, setIssueType] = useState("");
  const [service, setService] = useState("Home Fiber");
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");

  const createTicket = () => {
    if (!issueType || !description)
      return alert("Please complete all required fields.");

    setTickets([
      ...tickets,
      {
        id: tickets.length + 1,
        issueType,
        service,
        priority,
        status: "open",
        date: new Date().toISOString().split("T")[0],
        description,
      },
    ]);

    setIssueType("");
    setService("Home Fiber");
    setPriority("medium");
    setDescription("");
  };

  /* ===================== HELPERS ===================== */
  const badge = (bg: string, text: string) =>
    `rounded-full px-3 py-1 text-xs font-semibold ${bg} ${text}`;

  const statusStyle = (status: string) => {
    switch (status) {
      case "open":
        return badge("bg-green-100", "text-green-700");
      case "in-progress":
        return badge("bg-yellow-100", "text-yellow-700");
      case "resolved":
        return badge("bg-blue-100", "text-blue-700");
      default:
        return badge("bg-gray-100", "text-gray-700");
    }
  };

  const priorityStyle = (priority: string) => {
    switch (priority) {
      case "low":
        return badge("bg-blue-100", "text-blue-700");
      case "medium":
        return badge("bg-yellow-100", "text-yellow-700");
      case "high":
        return badge("bg-red-100", "text-red-700");
      case "urgent":
        return badge("bg-purple-100", "text-purple-700");
      default:
        return badge("bg-gray-100", "text-gray-700");
    }
  };

  return (
    <div className="space-y-10 p-4 sm:p-6">
      {/* ===================== HEADER ===================== */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Internet Support Tickets
        </h2>
        <p className="text-sm text-gray-600">
          Report internet problems, service issues, and customer inquiries
        </p>
      </div>

      {/* ===================== CREATE TICKET ===================== */}
      <div className="rounded-xl bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">
          Report an Internet Issue
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="rounded border p-2"
          >
            <option value="">Select Issue Type</option>
            <option>Slow Internet Speed</option>
            <option>No Internet Connection</option>
            <option>Intermittent Connection</option>
            <option>Frequent Disconnections</option>
            <option>High Latency / Ping</option>
            <option>Billing Inquiry</option>
            <option>Installation / Activation</option>
            <option>Router / Modem Issue</option>
          </select>

          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="rounded border p-2"
          >
            <option>Home Fiber</option>
            <option>Business Fiber</option>
            <option>Wireless Broadband</option>
            <option>Mobile Data</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded border p-2"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <textarea
          placeholder="Describe the problem in detail (when it happens, how often, affected devices, etc.)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-4 w-full rounded border p-3"
          rows={4}
        />

        <button
          onClick={createTicket}
          className="mt-4 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Submit Ticket
        </button>
      </div>

      {/* ===================== TICKETS LIST ===================== */}
      <div className="space-y-4">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="rounded-xl bg-white p-6 shadow hover:shadow-md"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-bold">{t.issueType}</h3>
                <p className="text-sm text-gray-600">{t.description}</p>

                <div className="flex flex-wrap gap-2">
                  <span className={statusStyle(t.status)}>
                    {t.status.toUpperCase()}
                  </span>

                  <span className={priorityStyle(t.priority)}>
                    {t.priority.toUpperCase()}
                  </span>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    {t.service}
                  </span>

                  <span className="text-xs text-gray-500">
                    Created: {t.date}
                  </span>
                </div>
              </div>

              <button className="self-start text-sm font-medium text-indigo-600 hover:underline">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {tickets.length === 0 && (
        <div className="rounded-xl bg-gray-50 p-8 text-center text-gray-600">
          No support tickets found.
        </div>
      )}
    </div>
  );
};

export default SupportTicketsPage;
