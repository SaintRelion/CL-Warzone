import { useState } from "react";

interface SupportTicket {
  id: number;
  issueType: string;
  service: string;
  status: string;
  priority: string;
  date: string;
  description: string;
  images?: string[];
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
      images: [],
    },
  ]);

  /* ===================== FORM STATE ===================== */
  const [issueType, setIssueType] = useState("");
  const [service, setService] = useState("Home Fiber");
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);

  /* ===================== IMAGE HANDLER ===================== */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const previews = Array.from(files).map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ===================== CREATE TICKET ===================== */
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
        images,
      },
    ]);

    setIssueType("");
    setService("Home Fiber");
    setPriority("medium");
    setDescription("");
    setImages([]);
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

        {/* ===================== IMAGE UPLOAD ===================== */}
        <div className="mt-5 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
          <p className="mb-2 text-sm font-semibold text-gray-700">
            Attach Images (Optional)
          </p>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="block w-full text-sm"
          />

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative h-20 overflow-hidden rounded-lg border"
                >
                  <img
                    src={img}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 rounded-full bg-red-600 px-1 text-xs text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={createTicket}
          className="mt-6 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Submit Ticket
        </button>
      </div>

      {/* ===================== TICKET LIST ===================== */}
      <div className="space-y-4">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="rounded-xl bg-white p-6 shadow hover:shadow-md"
          >
            <h3 className="text-lg font-bold">{t.issueType}</h3>
            <p className="text-sm text-gray-600">{t.description}</p>

            <div className="mt-2 flex gap-2">
              <span className={statusStyle(t.status)}>
                {t.status.toUpperCase()}
              </span>
              <span className={priorityStyle(t.priority)}>
                {t.priority.toUpperCase()}
              </span>
            </div>

            {t.images && t.images.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {t.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="h-16 w-full rounded-lg border object-cover"
                    alt="attachment"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportTicketsPage;
