import AdminSidebar from "@/components/AdminSidebar";
import AdminPage from "@/pages/admin/AdminPage";
import { Outlet } from "react-router-dom";

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <AdminPage>
        <Outlet />
      </AdminPage>
    </div>
  );
}
