import AdminSidebar from "@/components/AdminSidebar";
import ClientSideBar from "@/components/ClientSidebar";
import AdminPage from "@/pages/admin/AdminPage";
import ClientPage from "@/pages/client/ClientPage";
import { useAuth } from "@saintrelion/auth-lib";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  const { user } = useAuth();
  return (
    <>
      {user.role == "admin" ? (
        <div className="flex h-screen bg-gray-50">
          <AdminSidebar />
          <AdminPage>
            <Outlet />
          </AdminPage>
        </div>
      ) : (
        <div className="flex h-screen flex-col bg-gray-50 lg:flex-row">
          <ClientSideBar />
          <ClientPage>
            <Outlet />
          </ClientPage>
        </div>
      )}
    </>
  );
};
export default RootLayout;
