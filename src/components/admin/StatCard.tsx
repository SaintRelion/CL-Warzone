import React from "react";
import { type LucideIcon } from "lucide-react";

export interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  color: "blue" | "green" | "yellow" | "purple";
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  color,
}) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="mb-2 flex items-center gap-3">
        <div className={`${colorClasses[color]} rounded-lg p-2`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};
