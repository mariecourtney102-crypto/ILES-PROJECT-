import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const linkClass =
    "p-2 rounded-md transition";

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

  return (
    <div className="flex min-h-screen w-64 flex-col bg-teal-600 p-4 text-white">

      <h2 className="text-xl font-bold mb-6">{getTitle()}</h2>

      <nav className="flex flex-1 flex-col gap-4">

        {user.role === "student" && (
          <>
            <NavLink
              to="/student"
              end
              className={({ isActive }) =>
                `${linkClass} ${
                  isActive ? "bg-white text-teal-600 font-semibold" : "hover:bg-teal-500"
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/weeklylogs"
              end
              className={({ isActive }) =>
                `${linkClass} ${
                  isActive ? "bg-white text-teal-600 font-semibold" : "hover:bg-teal-500"
                }`
              }
            >
              Weekly Logs
            </NavLink>

            <NavLink
              to="/submitlog"
              end
              className={({ isActive }) =>
                `${linkClass} ${
                  isActive ? "bg-white text-teal-600 font-semibold" : "hover:bg-teal-500"
                }`
              }
            >
              Submit Log
            </NavLink>

            <NavLink
              to="/student/internship-details"
              end
              className={({ isActive }) =>
                `${linkClass} ${
                  isActive ? "bg-white text-teal-600 font-semibold" : "hover:bg-teal-500"
                }`
              }
            >
              Internship Details
            </NavLink>

            <NavLink
              to="/student/feedback"
              end
              className={({ isActive }) =>
                `${linkClass} ${
                  isActive ? "bg-white text-teal-600 font-semibold" : "hover:bg-teal-500"
                }`
              }
            >
              Feedback
            </NavLink>
          </>
        )}

        {user.role === "supervisor" && (
          <>
            <NavLink
              to="/supervisor"
              end
              className={({ isActive }) =>
                `${linkClass} ${
                  isActive ? "bg-white text-teal-600 font-semibold" : "hover:bg-teal-500"
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/supervisor/assigned-students"
              end
              className={({ isActive }) =>
                `${linkClass} ${
                  isActive ? "bg-white text-teal-600 font-semibold" : "hover:bg-teal-500"
                }`
              }
            >
              Assigned Students
            </NavLink>

            <NavLink
              to="/supervisor/feedback"
              end
              className={({ isActive }) =>
                `${linkClass} ${
                  isActive ? "bg-white text-teal-600 font-semibold" : "hover:bg-teal-500"
                }`
              }
            >
              Feedback
            </NavLink>
          </>
        )}

        {user.role === "admin" && (
          <>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `${linkClass} ${
                  isActive ? "bg-white text-teal-600 font-semibold" : "hover:bg-teal-500"
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/users"
              end
              className={({ isActive }) =>
                `${linkClass} ${
                  isActive ? "bg-white text-teal-600 font-semibold" : "hover:bg-teal-500"
                }`
              }
            >
              Users
            </NavLink>
          </>
        )}

      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-6 rounded-md border border-teal-300 px-3 py-2 text-left font-semibold transition hover:bg-teal-500"
      >
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
