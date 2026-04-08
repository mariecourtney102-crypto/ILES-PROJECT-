import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkClass =
    "p-2 rounded-md transition";

  return (
    <div className="w-64 bg-teal-600 text-white min-h-screen p-4">

      <h2 className="text-xl font-bold mb-6">Student Panel</h2>

      <nav className="flex flex-col gap-4">

        <NavLink
          to="/student"
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
          className={({ isActive }) =>
            `${linkClass} ${
              isActive ? "bg-white text-teal-600 font-semibold" : "hover:bg-teal-500"
            }`
          }
        >
          Submit Log
        </NavLink>

        <NavLink
          to="/student/internship"
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
          className={({ isActive }) =>
            `${linkClass} ${
              isActive ? "bg-white text-teal-600 font-semibold" : "hover:bg-teal-500"
            }`
          }
        >
          Feedback
        </NavLink>

      </nav>
    </div>
  );
}

export default Sidebar;