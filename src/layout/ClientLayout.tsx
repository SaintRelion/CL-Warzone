import ClientSideBar from "@/components/ClientSidebar";
import ClientPage from "@/pages/client/ClientPage";
import { Outlet } from "react-router-dom";

export function ClientLayout() {
  return (
    <div className="flex h-screen flex-col bg-gray-50 lg:flex-row">
      <ClientSideBar />
      <ClientPage>
        <Outlet />
      </ClientPage>
    </div>
  );
}
