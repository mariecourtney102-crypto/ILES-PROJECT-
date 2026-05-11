import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import AccountStatus from "./AccountStatus";

function DashboardLayout({ title, children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      {/* Main content area with responsive padding for sidebar */}
      <div className="flex-1 transition-all duration-300 md:ml-64 md:group-data-[collapsed]/sidebar:ml-20">
        <div className="min-h-screen flex flex-col">
          <div className="mb-4 flex items-center justify-between gap-4 p-6 pt-20 md:pt-6">
            <h1 className="text-3xl font-bold text-[#4CAF50]">
              {title}
            </h1>

            <div className="flex items-center gap-3">
              <AccountStatus />
              <NotificationBell />
            </div>
          </div>

          <div className="flex-1 px-6 pb-6">
            {children}
          </div>
        </div>
      </div>

    </div>
  );
}

export default DashboardLayout;
