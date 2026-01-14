import type { ClientTicket, CreateTicket } from "@/models/Tickets";
import type { User } from "@/models/user";
import { useCurrentUser } from "@saintrelion/auth-lib";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { useState } from "react";

const SupportTicketsPage = () => {
  const user = useCurrentUser<User>();

  const { useList: getMyTickets, useInsert: insertTicket } = useResourceLocked<
    ClientTicket,
    CreateTicket,
    never
  >("tickets");

  const myTickets = getMyTickets().data;

  /* ===================== FORM STATE ===================== */
  const [issueType, setIssueType] = useState("");
  const [service, setService] = useState("Home Fiber");
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");

  /* ===================== CREATE TICKET ===================== */
  const createTicket = async () => {
    if (!issueType || !description)
      return alert("Please complete all required fields.");

    const myTicket = {
      userId: user.id,
      customer: `${user.firstName} ${user.firstName}`,
      issue: issueType,
      description: description,
      priority: priority,
      status: "open",
      assignedTo: "",
    };

    await insertTicket.run(myTicket);

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
        <h3 className="mb-4 text-lg font-semibold">Report an Internet Issue</h3>

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
          placeholder="Describe the problem in detail"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-4 w-full rounded border p-3"
          rows={4}
        />

        <button
          onClick={createTicket}
          disabled={insertTicket.isLocked}
          className={`mt-6 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50`}
        >
          Submit Ticket
        </button>
      </div>

      {/* ===================== TICKET LIST ===================== */}
      <div className="space-y-4">
        {myTickets ? (
          myTickets.map((t) => (
            <div
              key={t.id}
              className="rounded-xl bg-white p-6 shadow hover:shadow-md"
            >
              <h3 className="text-lg font-bold">{t.issue}</h3>
              <p className="text-sm text-gray-600">{t.description}</p>

              <div className="mt-2 flex gap-2">
                <span className={statusStyle(t.status)}>
                  {t.status.toUpperCase()}
                </span>
                <span className={priorityStyle(t.priority)}>
                  {t.priority.toUpperCase()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div>No Tickets</div>
        )}
      </div>
    </div>
  );
};

export default SupportTicketsPage;
