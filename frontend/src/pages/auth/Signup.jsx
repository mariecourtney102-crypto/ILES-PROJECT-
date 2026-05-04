import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const FRIENDLY_FIELD_NAMES = {
  role: "role",
  username: "username",
  name: "full name",
  ID_number: "ID number",
  telephone_number: "phone number",
  course_title: "course title",
  university_name: "university name",
  year_of_study: "year of study",
  place_of_work: "place of work",
  department: "department",
  staff_ID: "staff ID",
  password: "password",
};

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
    role: "",
    ID_number: "",
    telephone_number: "",
    course_title: "",
    university_name: "",
    year_of_study: "",
    place_of_work: "",
    department: "",
    staff_ID: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getRoleFields = () => {
    if (formData.role === "student") {
      return ["course_title", "university_name", "year_of_study"];
    }

    if (formData.role === "supervisor") {
      return ["place_of_work", "department", "staff_ID"];
    }

    if (formData.role === "admin") {
      return ["department"];
    }

    return [];
  };

  const buildSignupData = () => {
    const signupData = {
      username: formData.username,
      name: formData.name,
      password: formData.password,
      role: formData.role,
      ID_number: formData.ID_number,
      telephone_number: formData.telephone_number || "",
    };

    if (formData.role === "student") {
      signupData.course_title = formData.course_title.trim();
      signupData.university_name = formData.university_name.trim();
      signupData.year_of_study = Number(formData.year_of_study);
    }

    if (formData.role === "supervisor") {
      signupData.place_of_work = formData.place_of_work.trim();
      signupData.department = formData.department.trim();
      signupData.staff_ID = formData.staff_ID.trim();
    }

    if (formData.role === "admin") {
      signupData.department = formData.department.trim();
    }

    return signupData;
  };

  const getBackendErrorMessage = (errorData) => {
    if (!errorData) {
      return "Signup failed. Please try again.";
    }

    if (typeof errorData.detail === "string") {
      return errorData.detail;
    }

    if (typeof errorData.error === "string") {
      return errorData.error;
    }

    for (const [field, value] of Object.entries(errorData)) {
      const message = Array.isArray(value) ? value[0] : value;
      if (!message) {
        continue;
      }

      if (field === "role" && String(message).toLowerCase().includes("blank")) {
        return "Please select a role.";
      }

      if (typeof message === "string") {
        const label = FRIENDLY_FIELD_NAMES[field];
        return label ? `${label.charAt(0).toUpperCase() + label.slice(1)}: ${message}` : message;
      }
    }

    return "Signup failed. Please try again.";
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.role) {
      setError("Please select a role before signing up");
      return;
    }

    if (!formData.username.trim() || !formData.name.trim() || !formData.password || !formData.confirmPassword || !formData.ID_number.trim()) {
      setError("All fields (except phone) are required");
      return;
    }

    const missingRoleField = getRoleFields().find((field) => !String(formData[field] ?? "").trim());
    if (missingRoleField) {
      setError("Please fill in all fields required for the selected role");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const signupData = buildSignupData();

      await api.post("/signup/", signupData);

      setSuccess("Account created successfully! Redirecting to login...");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorData = err.response?.data;
      setError(getBackendErrorMessage(errorData));
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-teal-700 to-teal-400">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-96">

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Account
        </h2>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-gray-700">
            Role
          </label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            disabled={loading}
            required
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="student">Student</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            disabled={loading}
          />

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            disabled={loading}
          />

          <input
            type="text"
            name="ID_number"
            placeholder="ID Number"
            value={formData.ID_number}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            disabled={loading}
          />

          <input
            type="tel"
            name="telephone_number"
            placeholder="Phone Number (Optional)"
            value={formData.telephone_number}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            disabled={loading}
          />

          {formData.role === "student" && (
            <>
              <input
                type="text"
                name="course_title"
                placeholder="Course Title"
                value={formData.course_title}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                disabled={loading}
              />

              <input
                type="text"
                name="university_name"
                placeholder="University Name"
                value={formData.university_name}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                disabled={loading}
              />

              <select
                name="year_of_study"
                value={formData.year_of_study}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                disabled={loading}
                required
              >
                <option value="" disabled>
                  Select Year of Study
                </option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
              </select>
            </>
          )}

          {formData.role === "supervisor" && (
            <>
              <input
                type="text"
                name="place_of_work"
                placeholder="Place of Work"
                value={formData.place_of_work}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                disabled={loading}
              />

              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                disabled={loading}
              />

              <input
                type="text"
                name="staff_ID"
                placeholder="Staff ID"
                value={formData.staff_ID}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                disabled={loading}
              />
            </>
          )}

          {formData.role === "admin" && (
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              disabled={loading}
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            disabled={loading}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            disabled={loading}
          />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-teal-500 cursor-pointer hover:underline font-semibold"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Signup;
