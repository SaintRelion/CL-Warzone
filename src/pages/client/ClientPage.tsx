import React, { useState, type JSX } from "react";

// -------------------------
// TYPES
// -------------------------

interface NewTicket {
  title: string;
  description: string;
  priority: string;
}

const ClientPage = ({ children }: { children: JSX.Element }) => {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  const [newTicket, setNewTicket] = useState<NewTicket>({
    title: "",
    description: "",
    priority: "medium",
  });
  const [viewingTicket, setViewingTicket] = useState<SupportTicket | null>(
    null,
  );

  return (
    <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
      <div className="mx-auto max-w-6xl p-4 md:p-8">{children}</div>
    </main>
  );
};

export default ClientPage;
