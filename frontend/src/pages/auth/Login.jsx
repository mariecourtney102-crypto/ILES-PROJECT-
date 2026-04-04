
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [identifier, setIdentifier] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password || !identifier) {
      alert("please fill all fields");
      return;
    }

    const userData = {
      role,
      email,
      identifier,
    };

    login(userData);
    const roleRoutes = {
      admin: "/admin",
      supervisor: "/supervisor",
      student: "/student",
    };

    navigate(roleRoutes[role]);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-teal-700 to-teal-400">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-80">

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          ILES Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* ✅ ROLE SELECT */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 border rounded-lg bg-teal-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="student">Student</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin">Admin</option>
          </select>

          {/* ✅ IDENTIFIER */}
          <input
            type="text"
            placeholder="Identifier (ID)"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            onChange={(e) => setIdentifier(e.target.value)}
          />

          {/* ✅ EMAIL */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* ✅ PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            Login
          </button>

        </form>

        <p className="mt-5 text-sm text-center">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-teal-500 font-semibold cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;