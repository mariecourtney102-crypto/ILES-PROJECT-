
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { getRoleRoute } from "../../utils/roleRoutes";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(username, password);
      
      // Store user info in AuthContext
      login({
        token: data.token,
        username: username,
        role: data.role,
        name: data.name,
      });

      navigate(getRoleRoute(data.role));
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-teal-700 to-teal-400">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-80">

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          ILES Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            disabled={loading}
          />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
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
