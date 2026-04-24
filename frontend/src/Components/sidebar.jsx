import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const { user ,logout } = useAuth();

  const handleLogout = () =>{
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    logout();
    Navigate("/login");
  };
  const linkClass =
    "p-2 rounded-md transition";

  if (!user) return null;

  const getTitle = () => {
    if (user.role === "supervisor") return "Supervisor Panel";
    if (user.role === "admin") return "Admin Panel";
    return "Student Panel";
  };

  return (
    <div className="w-64 bg-teal-600 text-white min-h-screen p-4">

      <h2 className="text-xl font-bold mb-6">{getTitle()}</h2>

      <nav className="flex flex-col gap-4">

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
              to="/admin/settings"
              className={({ isActive }) =>
                `${linkClass} ${
                  isActive ? "bg-white text-teal-600 font-semibold" : "hover:bg-teal-500"
                }`
              }
            >
              Settings
            </NavLink>
          </>
        )}

      </nav>
      <button
        onClick = {handleLogout}
        className = "mt-6 p-2 bg-white-200 rounded-md hover:bg-teal-600"
      >
        Logout
      </button>
    </div>
  );
}

export default Sidebar;