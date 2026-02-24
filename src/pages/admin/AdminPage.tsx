import { useState, useEffect, type JSX } from "react";
import { useLocation } from "react-router-dom";

export default function AdminPage({ children }: { children: JSX.Element }) {
  const location = useLocation();

  const splits = location.pathname.split("/");
  const pageName =
    splits.length == 2 || splits[2] == ""
      ? "DASHBOARD"
      : splits[2].toUpperCase();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {pageName}
              </h1>
              <p className="text-sm text-gray-500">
                {currentTime.toLocaleString()}
              </p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </>
  );
}
