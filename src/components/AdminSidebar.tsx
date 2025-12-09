import { logout } from "@saintrelion/auth-lib";
import { renderNavItems } from "@saintrelion/routers";
import { ChevronLeft, ChevronRight, Wifi } from "lucide-react";
import { useState } from "react";

const AdminSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <aside
      className={`${sidebarOpen ? "w-64" : "w-20"} flex flex-col bg-gray-900 text-white transition-all duration-300`}
    >
      <div className="flex items-center justify-between border-b border-gray-700 p-4">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <Wifi className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-bold">Warzone Net Cafe</span>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 hover:bg-gray-800"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {renderNavItems({
          role: "admin",
          baseClassName:
            "flex w-full items-center gap-3 rounded-lg px-3 py-3 transition-colors text-gray-300 text-opacity-0 hover:bg-gray-800",
          activeClassName:
            "flex w-full items-center gap-3 rounded-lg px-3 py-3 transition-colors bg-blue-600 text-white",
          labelClassname: sidebarOpen ? "" : "hidden",
        })}
      </nav>

      <div className="p-4">
        <button
          onClick={() => {
            logout(() => {
              window.location.href = "/login";
            });
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition hover:bg-red-700"
        >
          <span className="fa-solid fa-arrow-right-from-bracket text-lg" />
          <span className={sidebarOpen ? "" : "hidden"}>Logout</span>
        </button>
      </div>

      {sidebarOpen && (
        <div className="border-t border-gray-700 p-4">
          <div className="text-xs text-gray-400">System Status</div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
            <span className="text-sm">All Systems Operational</span>
          </div>
        </div>
      )}
    </aside>
  );
};
export default AdminSidebar;
