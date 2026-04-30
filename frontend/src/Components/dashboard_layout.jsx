import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";

function DashboardLayout({ title, children }) {
  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <div className="flex-1 p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-teal-500">
            {title}
          </h1>

          <NotificationBell />
        </div>

        {children}
      </div>

    </div>
  );
}

export default DashboardLayout;
