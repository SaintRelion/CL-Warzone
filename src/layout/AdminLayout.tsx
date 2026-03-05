import AdminSidebar from "@/components/AdminSidebar";
// import { LiveEventSubscriber } from "@/components/LiveEventSubscriber";
import AdminPage from "@/pages/admin/AdminPage";
import { Outlet } from "react-router-dom";

export function AdminLayout() {
  return (
    <>
      {/* <LiveEventSubscriber /> */}
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <AdminPage>
          <Outlet />
        </AdminPage>
      </div>
    </>
  );
}
