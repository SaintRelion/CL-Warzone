import { useState, useEffect, type JSX } from "react";
import { Modal } from "@/components/admin/Modals";

type ModalMode = "add" | "edit";

export default function AdminPage({ children }: { children: JSX.Element }) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");

  // Data states for CRUD

  const tickets = [
    {
      id: 1,
      customer: "Juan dela Cruz",
      issue: "No Connection",
      priority: "Critical",
      status: "Open",
      assignedTo: "Tech-01",
    },
    {
      id: 2,
      customer: "Maria Santos",
      issue: "Slow Browsing",
      priority: "High",
      status: "In Progress",
      assignedTo: "Tech-02",
    },
    {
      id: 3,
      customer: "Pedro Reyes",
      issue: "Billing Issue",
      priority: "Medium",
      status: "Open",
      assignedTo: "Tech-03",
    },
  ];

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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {/* {activeMenu} */} ACTIVE MENU
              </h1>
              <p className="text-sm text-gray-500">
                {currentTime.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
                <span className="text-sm font-semibold text-gray-700">
                  Network: Normal
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Uptime</div>
                <div className="text-lg font-bold text-green-600">99.97%</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          type={"subscribers"}
          modalMode={modalMode}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
}
