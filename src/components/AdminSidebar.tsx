import { useAuth } from "@saintrelion/auth-lib";
import { renderNavItems } from "@saintrelion/routers";

import { useEffect, useState } from "react";

const AdminSidebar = () => {
  const auth = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Detect small screens
  useEffect(() => {
    const media = window.matchMedia("(max-width: 600px)");
    setIsSmallScreen(media.matches); // initial check
    setSidebarOpen(!media.matches); // close sidebar on small screens

    const listener = () => {
      setIsSmallScreen(media.matches);
      setSidebarOpen(!media.matches); // auto-close if small
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } flex flex-col bg-gray-900 text-white transition-all duration-300`}
    >
      <div className="flex items-center justify-between border-b border-gray-700 p-4">

       {sidebarOpen && (
        <div className="flex items-center gap-2">
          <img
            src="/my-logo.png"
            alt="Warzone Logo"
            className="h-8 w-auto object-contain"
          />
          <span className="text-lg font-bold">WarzoneNetCafe</span>
        </div>
            )}
        <button
          onClick={() => {
            if (!isSmallScreen) setSidebarOpen(!sidebarOpen);
          }}
          className={`rounded-lg p-2 hover:bg-gray-800 ${
            isSmallScreen ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isSmallScreen} // block on small screens
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
          onClick={async () => {
            await auth.logout();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition hover:bg-red-700"
        >
          <span className="fa-solid fa-arrow-right-from-bracket text-lg" />
          <span className={sidebarOpen ? "" : "hidden"}>Logout</span>
        </button>
      </div>
    </aside>
  );
};
export default AdminSidebar;
