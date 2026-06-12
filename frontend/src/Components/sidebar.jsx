import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Menu, X, LayoutDashboard, FileText, LogOut, Send, Briefcase, MessageSquare, Users, BarChart3, Settings } from "lucide-react";

const COLORS = {
  sidebar: "bg-[#0a7c6e]",
  sidebarDark: "bg-[#065f52]",
  sidebarBorder: "border-white/10",
  itemActive: "bg-[#0d9e8c]",
  itemHover: "hover:bg-[#0d9e8c]",
  itemText: "text-white",
  logout: "bg-[#0a7c6e]",
  logoutHover: "hover:bg-[#0d9e8c]",
  toggle: "bg-[#0a7c6e]",
};

function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const getTitle = () => {
    if (user.role === "supervisor") return "Supervisor Panel";
    if (user.role === "admin") return "Admin Panel";
    return "Student Panel";
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const toggleMobileSidebar = () => {
    setIsOpen((current) => !current);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Icon mapping for menu items
  const getIcon = (label) => {
    const iconProps = { size: 20, className: "flex-shrink-0" };
    const iconMap = {
      "Dashboard": <LayoutDashboard {...iconProps} />,
      "Weekly Logs": <FileText {...iconProps} />,
      "Reports": <BarChart3 {...iconProps} />,
      "Submit Log": <Send {...iconProps} />,
      "Internship Details": <Briefcase {...iconProps} />,
      "Feedback": <MessageSquare {...iconProps} />,
      "Assigned Students": <Users {...iconProps} />,
      "Users": <Users {...iconProps} />,
      "Reports": <BarChart3 {...iconProps} />,
      "Settings": <Settings {...iconProps} />,
    };
    return iconMap[label] || null;
  };

  return (
    <>
      {/* Single toggle button for both mobile and desktop */}
      <button
        onClick={toggleMobileSidebar}
        className={`fixed left-4 top-4 z-50 rounded-lg p-3 text-white transition-all md:hidden ${COLORS.toggle}`}
        title={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-64 shrink-0 flex-col overflow-y-auto bg-[#0a7c6e] text-white transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-start gap-3 px-5 py-4 border-b ${COLORS.sidebarBorder} transition-all duration-300`}>
          {!isCollapsed && <h2 className="text-2xl font-semibold tracking-tight truncate">{getTitle()}</h2>}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 p-4 space-y-2 transition-all duration-300`}>

          {/* Student Menu */}
          {user.role === "student" && (
            <>
              <NavLink
                to="/student"
                end
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? `${COLORS.itemActive} text-white font-semibold shadow-sm`
                      : `text-white/90 ${COLORS.itemHover}`
                  } ${isCollapsed ? "md:justify-center" : ""}`
                }
                title={isCollapsed ? "Dashboard" : ""}
              >
                {getIcon("Dashboard")}
                {!isCollapsed && <span className="truncate">Dashboard</span>}
              </NavLink>

              <NavLink
                to="/weeklylogs"
                end
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? `${COLORS.itemActive} text-white font-semibold shadow-sm`
                      : `text-white/90 ${COLORS.itemHover}`
                  } ${isCollapsed ? "md:justify-center" : ""}`
                }
                title={isCollapsed ? "Weekly Logs" : ""}
              >
                {getIcon("Weekly Logs")}
                {!isCollapsed && <span className="truncate">Weekly Logs</span>}
              </NavLink>

              <NavLink
                to="/submitlog"
                end
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? `${COLORS.itemActive} text-white font-semibold shadow-sm`
                      : `text-white/90 ${COLORS.itemHover}`
                  } ${isCollapsed ? "md:justify-center" : ""}`
                }
                title={isCollapsed ? "Submit Log" : ""}
              >
                {getIcon("Submit Log")}
                {!isCollapsed && <span className="truncate">Submit Log</span>}
              </NavLink>

              <NavLink
                to="/student/internship-details"
                end
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? `${COLORS.itemActive} text-white font-semibold shadow-sm`
                      : `text-white/90 ${COLORS.itemHover}`
                  } ${isCollapsed ? "md:justify-center" : ""}`
                }
                title={isCollapsed ? "Internship Details" : ""}
              >
                {getIcon("Internship Details")}
                {!isCollapsed && <span className="truncate">Internship Details</span>}
              </NavLink>

              <NavLink
                to="/student/reports"
                end
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? `${COLORS.itemActive} text-white font-semibold shadow-sm`
                      : `text-white/90 ${COLORS.itemHover}`
                  } ${isCollapsed ? "md:justify-center" : ""}`
                }
                title={isCollapsed ? "Reports" : ""}
              >
                {getIcon("Reports")}
                {!isCollapsed && <span className="truncate">Reports</span>}
              </NavLink>

              <NavLink
                to="/student/feedback"
                end
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? `${COLORS.itemActive} text-white font-semibold shadow-sm`
                      : `text-white/90 ${COLORS.itemHover}`
                  } ${isCollapsed ? "md:justify-center" : ""}`
                }
                title={isCollapsed ? "Feedback" : ""}
              >
                {getIcon("Feedback")}
                {!isCollapsed && <span className="truncate">Feedback</span>}
              </NavLink>
            </>
          )}

          {/* Supervisor Menu */}
          {user.role === "supervisor" && (
            <>
              <NavLink
                to="/supervisor"
                end
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? `${COLORS.itemActive} text-white font-semibold shadow-sm`
                      : `text-white/90 ${COLORS.itemHover}`
                  } ${isCollapsed ? "md:justify-center" : ""}`
                }
                title={isCollapsed ? "Dashboard" : ""}
              >
                {getIcon("Dashboard")}
                {!isCollapsed && <span className="truncate">Dashboard</span>}
              </NavLink>

              <NavLink
                to="/supervisor/assigned-students"
                end
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? `${COLORS.itemActive} text-white font-semibold shadow-sm`
                      : `text-white/90 ${COLORS.itemHover}`
                  } ${isCollapsed ? "md:justify-center" : ""}`
                }
                title={isCollapsed ? "Assigned Students" : ""}
              >
                {getIcon("Assigned Students")}
                {!isCollapsed && <span className="truncate">Assigned Students</span>}
              </NavLink>

              <NavLink
                to="/supervisor/feedback"
                end
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? `${COLORS.itemActive} text-white font-semibold shadow-sm`
                      : `text-white/90 ${COLORS.itemHover}`
                  } ${isCollapsed ? "md:justify-center" : ""}`
                }
                title={isCollapsed ? "Feedback" : ""}
              >
                {getIcon("Feedback")}
                {!isCollapsed && <span className="truncate">Feedback</span>}
              </NavLink>
            </>
          )}

          {/* Admin Menu */}
          {user.role === "admin" && (
            <>
              <NavLink
                to="/admin"
                end
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? `${COLORS.itemActive} text-white font-semibold shadow-sm`
                      : `text-white/90 ${COLORS.itemHover}`
                  } ${isCollapsed ? "md:justify-center" : ""}`
                }
                title={isCollapsed ? "Dashboard" : ""}
              >
                {getIcon("Dashboard")}
                {!isCollapsed && <span className="truncate">Dashboard</span>}
              </NavLink>

              <NavLink
                to="/admin/users"
                end
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? `${COLORS.itemActive} text-white font-semibold shadow-sm`
                      : `text-white/90 ${COLORS.itemHover}`
                  } ${isCollapsed ? "md:justify-center" : ""}`
                }
                title={isCollapsed ? "Users" : ""}
              >
                {getIcon("Users")}
                {!isCollapsed && <span className="truncate">Users</span>}
              </NavLink>

              <NavLink
                to="/admin/feedback"
                end
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? `${COLORS.itemActive} text-white font-semibold shadow-sm`
                      : `text-white/90 ${COLORS.itemHover}`
                  } ${isCollapsed ? "md:justify-center" : ""}`
                }
                title={isCollapsed ? "Feedback" : ""}
              >
                {getIcon("Feedback")}
                {!isCollapsed && <span className="truncate">Feedback</span>}
              </NavLink>

              <NavLink
                to="/admin/reports"
                end
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? `${COLORS.itemActive} text-white font-semibold shadow-sm`
                      : `text-white/90 ${COLORS.itemHover}`
                  } ${isCollapsed ? "md:justify-center" : ""}`
                }
                title={isCollapsed ? "Reports" : ""}
              >
                {getIcon("Reports")}
                {!isCollapsed && <span className="truncate">Reports</span>}
              </NavLink>

              <NavLink
                to="/admin/settings"
                end
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? `${COLORS.itemActive} text-white font-semibold shadow-sm`
                      : `text-white/90 ${COLORS.itemHover}`
                  } ${isCollapsed ? "md:justify-center" : ""}`
                }
                title={isCollapsed ? "Settings" : ""}
              >
                {getIcon("Settings")}
                {!isCollapsed && <span className="truncate">Settings</span>}
              </NavLink>
            </>
          )}
        </nav>

        {/* Logout Button */}
        <div className={`border-t ${COLORS.sidebarBorder} p-3 transition-all duration-300 ${COLORS.logout}`}>
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-white/15 bg-white/10 text-white font-semibold shadow-sm transition-all duration-200 ${COLORS.logoutHover} ${
              isCollapsed ? "md:justify-center" : ""
            }`}
            title={isCollapsed ? "Logout" : ""}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="truncate">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
