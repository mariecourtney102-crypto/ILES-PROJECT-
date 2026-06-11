import { Outlet } from "react-router-dom";
import Sidebar from "../Components/sidebar";

function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <div className="flex min-h-screen flex-col">
          <header className="bg-white shadow p-4">
            <h1>Admin Panel</h1>
          </header>

          <main className="p-6">
            <Outlet />  {/* THIS is where pages render */}
          </main>
        </div>
      </div>

    </div>
  );
}

export default AdminLayout;
