import { logout } from "@saintrelion/auth-lib";
import { renderNavItems } from "@saintrelion/routers";
import { useState } from "react";

const ClientSideBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-indigo-600 p-2 text-white shadow-lg lg:hidden"
      >
        {sidebarOpen ? (
          <span className="fa-solid fa-x text-xl" />
        ) : (
          <span className="fa-solid fa-bars text-xl" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} overflow-y-auto`}
      >
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-2">
            <span className="fa-solid fa-wifi text-2xl text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900">InternetPro</h1>
          </div>
        </div>

        <nav className="flex flex-col space-y-2 p-4">
          {renderNavItems({
            role: "client",
            baseClassName:
              "w-full rounded-lg px-4 py-3 text-left transition-colors text-gray-700 hover:bg-gray-100",
            activeClassName:
              "w-full rounded-lg px-4 py-3 text-left transition-colors bg-indigo-600 text-white",
          })}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <button
            onClick={() => {
              logout(() => {
                window.location.href = "/login";
              });
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition hover:bg-red-700"
          >
            <span className="fa-solid fa-arrow-right-from-bracket text-lg" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
export default ClientSideBar;
