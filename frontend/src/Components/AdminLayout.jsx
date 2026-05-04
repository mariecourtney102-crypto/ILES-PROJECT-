import { Outlet } from "react-router-dom";
import Sidebar from "../Components/sidebar";

function AdminLayout() {
  return (
    <div className="flex h-screen">
      
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4">
          <h1>Admin Panel</h1>
        </header>

        <main className="p-6">
          <Outlet />  {/* THIS is where pages render */}
        </main>
      </div>

    </div>
  );
}

export default AdminLayout;