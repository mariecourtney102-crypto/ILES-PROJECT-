import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const FRIENDLY_FIELD_NAMES = {
  role: "role",
  username: "username",
  name: "full name",
  email: "email address",
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
  const submitButtonRef = useRef(null);
  const fieldRefs = {
    role: useRef(null),
    username: useRef(null),
    name: useRef(null),
    email: useRef(null),
    ID_number: useRef(null),
    telephone_number: useRef(null),
    course_title: useRef(null),
    university_name: useRef(null),
    year_of_study: useRef(null),
    place_of_work: useRef(null),
    department: useRef(null),
    staff_ID: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
  };

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
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

  const focusNextField = (event, nextFieldRef) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    if (nextFieldRef?.current) {
      nextFieldRef.current.focus();
      return;
    }

    submitButtonRef.current?.focus();
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
      email: formData.email,
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

    if (!formData.username.trim() || !formData.name.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword || !formData.ID_number.trim()) {
      setError("All fields except phone number are required");
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
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#0a7c6e] via-[#0d9e8c] to-[#3db88a]">

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
            ref={fieldRefs.role}
            onKeyDown={(e) => focusNextField(e, fieldRefs.username)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9e8c]"
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
            ref={fieldRefs.username}
            onKeyDown={(e) => focusNextField(e, fieldRefs.name)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9e8c]"
            disabled={loading}
          />

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            ref={fieldRefs.name}
            onKeyDown={(e) => focusNextField(e, fieldRefs.email)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9e8c]"
            disabled={loading}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            ref={fieldRefs.email}
            onKeyDown={(e) => focusNextField(e, fieldRefs.ID_number)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9e8c]"
            disabled={loading}
          />

          <input
            type="text"
            name="ID_number"
            placeholder="ID Number"
            value={formData.ID_number}
            onChange={handleChange}
            ref={fieldRefs.ID_number}
            onKeyDown={(e) => focusNextField(e, fieldRefs.telephone_number)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9e8c]"
            disabled={loading}
          />

          <input
            type="tel"
            name="telephone_number"
            placeholder="Phone Number (Optional)"
            value={formData.telephone_number}
            onChange={handleChange}
            ref={fieldRefs.telephone_number}
            onKeyDown={(e) => focusNextField(
              e,
              formData.role === "student"
                ? fieldRefs.course_title
                : formData.role === "supervisor"
                  ? fieldRefs.place_of_work
                  : formData.role === "admin"
                    ? fieldRefs.department
                    : fieldRefs.password
            )}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9e8c]"
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
                ref={fieldRefs.course_title}
                onKeyDown={(e) => focusNextField(e, fieldRefs.university_name)}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9e8c]"
                disabled={loading}
              />

              <input
                type="text"
                name="university_name"
                placeholder="University Name"
                value={formData.university_name}
                onChange={handleChange}
                ref={fieldRefs.university_name}
                onKeyDown={(e) => focusNextField(e, fieldRefs.year_of_study)}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9e8c]"
                disabled={loading}
              />

              <select
                name="year_of_study"
                value={formData.year_of_study}
                onChange={handleChange}
                ref={fieldRefs.year_of_study}
                onKeyDown={(e) => focusNextField(e, fieldRefs.password)}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9e8c]"
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
                ref={fieldRefs.place_of_work}
                onKeyDown={(e) => focusNextField(e, fieldRefs.department)}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9e8c]"
                disabled={loading}
              />

              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                ref={fieldRefs.department}
                onKeyDown={(e) => focusNextField(e, fieldRefs.staff_ID)}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9e8c]"
                disabled={loading}
              />

              <input
                type="text"
                name="staff_ID"
                placeholder="Staff ID"
                value={formData.staff_ID}
                onChange={handleChange}
                ref={fieldRefs.staff_ID}
                onKeyDown={(e) => focusNextField(e, fieldRefs.password)}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9e8c]"
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
              ref={fieldRefs.department}
              onKeyDown={(e) => focusNextField(e, fieldRefs.password)}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9e8c]"
              disabled={loading}
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            ref={fieldRefs.password}
            onKeyDown={(e) => focusNextField(e, fieldRefs.confirmPassword)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9e8c]"
            disabled={loading}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            ref={fieldRefs.confirmPassword}
            onKeyDown={(e) => focusNextField(e, submitButtonRef)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9e8c]"
            disabled={loading}
          />

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-[#ecfdf5] border border-[#86efac] text-[#166534] px-4 py-2 rounded text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            ref={submitButtonRef}
            disabled={loading}
            className="bg-[#0a7c6e] hover:bg-[#065f52] text-white py-3 rounded-lg font-semibold transition duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#0a7c6e] cursor-pointer hover:underline font-semibold"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Signup;
