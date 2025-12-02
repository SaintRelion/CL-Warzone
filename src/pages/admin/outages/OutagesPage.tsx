import { DataTable } from "@/components/admin/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

const OutagesPage = () => {
  const outages = [
    {
      id: 1,
      location: "Brgy. San Jose",
      affectedUsers: 45,
      status: "Ongoing",
      startTime: "10:30 AM",
      eta: "2:00 PM",
    },
    {
      id: 2,
      location: "Brgy. Poblacion",
      affectedUsers: 12,
      status: "Resolved",
      startTime: "8:00 AM",
      eta: "Completed",
    },
  ];

  const outagesColumns: ColumnDef<(typeof outages)[number]>[] = [
    { accessorKey: "location", header: "Location" },
    { accessorKey: "affectedUsers", header: "Affected Users" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const val = getValue<string>();
        const color =
          val === "Ongoing"
            ? "bg-red-100 text-red-800"
            : "bg-green-100 text-green-800";
        return (
          <span className={`rounded px-2 py-1 text-xs font-semibold ${color}`}>
            {val}
          </span>
        );
      },
    },
    { accessorKey: "startTime", header: "Start Time" },
    { accessorKey: "eta", header: "ETA" },
  ];

  return <DataTable type="outages" data={outages} columns={outagesColumns} />;
};
export default OutagesPage;
