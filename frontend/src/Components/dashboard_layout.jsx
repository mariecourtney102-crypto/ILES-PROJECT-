import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../context/AuthContext";
import { Menu } from "lucide-react";
import { useState } from "react";

function getRoleLabel(role) {
  if (role === "supervisor") return "Supervisor";
  if (role === "admin") return "Academic Admin";
  return "Student";
}

function DashboardLayout({ title, children }) {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const initials = (user?.name || user?.email || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-teal-50/40 text-slate-900">

      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
      />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex h-[62px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-xl border border-teal-100 p-2 text-teal-700 hover:bg-teal-50 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          <button
            type="button"
            onClick={() => setSidebarCollapsed((current) => !current)}
            className="hidden rounded-xl border border-teal-100 p-2 text-teal-700 hover:bg-teal-50 lg:inline-flex"
            aria-label={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="h-7 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold leading-4 text-slate-900">{user?.name || "ILES User"}</p>
                <p className="text-xs text-slate-500">{getRoleLabel(user?.role)}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6">
          {title ? <span className="sr-only">{title}</span> : null}
          {children}
        </main>
      </div>

    </div>
  );
}

export default DashboardLayout;
