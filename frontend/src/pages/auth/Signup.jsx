import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (!email.trim() || !role || !password || !confirmPassword) 
    {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log({email,role,password});

  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-teal-700 to-teal-400">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-80">

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Account
        </h2>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">

          <select
            className="p-3 border rounded-lg focus:ring-2 focus:ring-teal-400"
            onChange={(e) => setRole(e.target.value)}
          >
            <option value = " " >select role</option>
            <option value="student">Student</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="email"
            placeholder="Email"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-teal-400"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-teal-400"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-teal-400"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button className="bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition">
            Sign Up
          </button>

        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-teal-500 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Signup;