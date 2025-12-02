import { DataTable } from "@/components/admin/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

const EquipmentsPage = () => {
  const equipment = [
    {
      id: 1,
      type: "Router",
      model: "Cisco RV340",
      location: "Tower A",
      status: "Online",
      lastSeen: "2 mins ago",
    },
    {
      id: 2,
      type: "ONU",
      model: "Huawei HG8546M",
      location: "Customer-001",
      status: "Online",
      lastSeen: "5 mins ago",
    },
    {
      id: 3,
      type: "Switch",
      model: "TP-Link TL-SG108",
      location: "Tower B",
      status: "Offline",
      lastSeen: "2 hours ago",
    },
  ];

  const equipmentColumns: ColumnDef<(typeof equipment)[number]>[] = [
    { accessorKey: "type", header: "Type" },
    { accessorKey: "model", header: "Model" },
    { accessorKey: "location", header: "Location" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const val = getValue<string>();
        const color =
          val === "Online"
            ? "bg-green-100 text-green-800"
            : val === "Offline"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800";
        return (
          <span className={`rounded px-2 py-1 text-xs font-semibold ${color}`}>
            {val}
          </span>
        );
      },
    },
    { accessorKey: "lastSeen", header: "Last Seen" },
  ];

  return (
    <DataTable type="equipment" data={equipment} columns={equipmentColumns} />
  );
};
export default EquipmentsPage;
