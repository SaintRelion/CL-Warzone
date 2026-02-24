import type { SupportTicket } from "@/models/SupportTicket";

import { AlertCircle, CheckCircle, Clock, MessageSquare } from "lucide-react";
import { useMemo } from "react";

const KPICards = ({ tickets }: { tickets: SupportTicket[] }) => {
  const ticketStats = useMemo(() => {
    return tickets.reduce<Record<string, number>>((acc, ticket) => {
      acc.total = (acc.total || 0) + 1;
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {});
  }, [tickets]);

  const ticketCards = [
    {
      key: "total",
      label: "Total Tickets",
      icon: AlertCircle,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      key: "open",
      label: "Open",
      icon: Clock,
      bg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      key: "in_progress",
      label: "In Progress",
      icon: MessageSquare,
      bg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      key: "resolved",
      label: "Resolved",
      icon: CheckCircle,
      bg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ticketCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.key}
              className="rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-full p-2 ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {ticketStats[card.key] || 0}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default KPICards;
