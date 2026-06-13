import { useState } from "react";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import AccountStatus from "./AccountStatus";

function DashboardLayout({ title, children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#fbfefe] to-[#f3fbf9]">

      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main content area */}
      <div className={`min-h-screen overflow-y-auto transition-all duration-300 ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}>
        <div className="min-h-screen flex flex-col">
          <div className="mx-auto mb-4 flex w-full max-w-[1200px] items-center justify-between gap-4 px-6 pt-20 md:pt-6">
            <h1 className="text-3xl font-bold tracking-tight text-[#0a7c6e]">
              {title}
            </h1>

            <div className="flex items-center gap-3">
              <AccountStatus />
              <NotificationBell />
            </div>
          </div>

          <div className="mx-auto flex-1 w-full max-w-[1200px] px-6 pb-6">
            {children}
          </div>
        </div>
      </div>

    </div>
  );
}

export default DashboardLayout;
