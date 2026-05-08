import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  BarChart3,
  BookOpen,
  Building2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";

function Sidebar({ collapsed = false, mobileOpen = false, onClose, onToggleCollapse }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) return null;

  const getLinks = () => {
    if (user.role === "student") {
      return [
        { to: "/student", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
        { to: "/weeklylogs", label: "Weekly Logs", icon: <BookOpen size={18} /> },
        { to: "/submitlog", label: "Submit Log", icon: <ClipboardList size={18} /> },
        { to: "/student/internship-details", label: "Internship Details", icon: <Building2 size={18} /> },
        { to: "/student/feedback", label: "Feedback", icon: <MessageSquare size={18} /> },
      ];
    }

    if (user.role === "supervisor") {
      return [
        { to: "/supervisor", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
        { to: "/supervisor/assigned-students", label: "Assigned Students", icon: <Users size={18} /> },
        { to: "/supervisor/feedback", label: "Review Logs", icon: <MessageSquare size={18} /> },
      ];
    }

    return [
      { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
      { to: "/admin/users", label: "Users", icon: <Users size={18} /> },
      { to: "/admin/feedback", label: "Feedback", icon: <MessageSquare size={18} /> },
      { to: "/admin/reports", label: "Reports", icon: <BarChart3 size={18} /> },
      { to: "/admin/opportunities", label: "Opportunities", icon: <Building2 size={18} /> },
      { to: "/admin/settings", label: "Settings", icon: <Settings size={18} /> },
    ];
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    onClose?.();
  };

  const sidebarContent = ({ isCollapsed = false, isMobile = false } = {}) => (
    <>
      <div className={`flex h-[62px] items-center border-b border-teal-100 bg-white/70 ${isCollapsed ? "justify-center px-2" : "px-5"}`}>
        {isMobile ? (
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-teal-100 lg:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      <nav className={`flex flex-1 flex-col gap-2 py-4 ${isCollapsed ? "px-2" : "px-3"}`}>
        {getLinks().map(({ to, label, icon }) => (
          <NavLink
            key={`${to}-${label}`}
            to={to}
            end
            title={isCollapsed ? label : undefined}
            className={({ isActive }) =>
              `flex h-11 items-center gap-3 rounded-xl text-sm font-semibold transition ${
                isCollapsed ? "justify-center px-2" : "px-4"
              } ${
                isActive
                  ? "bg-teal-500 text-white shadow-lg shadow-teal-200"
                  : "text-slate-600 hover:bg-white hover:text-teal-700"
              }`
            }
            onClick={onClose}
          >
            {icon}
            <span className={isCollapsed ? "sr-only" : ""}>{label}</span>
          </NavLink>
        ))}
      </nav>

      {!isMobile ? (
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`flex h-11 items-center gap-3 border-t border-teal-100 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-teal-700 ${
            isCollapsed ? "justify-center px-2" : "px-6"
          }`}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <SlidersHorizontal size={18} />
          <span className={isCollapsed ? "sr-only" : ""}>{isCollapsed ? "Expand" : "Collapse"}</span>
        </button>
      ) : null}

      <button
        type="button"
        onClick={handleLogout}
        className={`flex h-14 items-center gap-3 border-t border-teal-100 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-teal-700 ${
          isCollapsed ? "justify-center px-2" : "px-6"
        }`}
        title={isCollapsed ? "Sign out" : undefined}
      >
        <LogOut size={18} />
        <span className={isCollapsed ? "sr-only" : ""}>Sign out</span>
      </button>
    </>
  );

  return (
    <>
      <aside
        className={`hidden min-h-screen shrink-0 flex-col border-r border-teal-100 bg-teal-50 text-slate-700 transition-all duration-200 lg:flex ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent({ isCollapsed: collapsed })}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-30 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/40"
            onClick={onClose}
            aria-label="Close navigation overlay"
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-teal-100 bg-teal-50 text-slate-700 shadow-2xl">
            {sidebarContent({ isMobile: true })}
          </aside>
        </div>
      ) : null}
    </>
  );
}

export default Sidebar;
