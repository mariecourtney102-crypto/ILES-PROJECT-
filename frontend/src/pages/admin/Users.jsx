import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../Components/dashboard_layout";
import api from "../../api/api";

function Users() {
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [selectedSupervisors, setSelectedSupervisors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const assignedCount = useMemo(
    () => students.filter((student) => student.assigned_supervisor).length,
    [students]
  );

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const [studentsResponse, supervisorsResponse] = await Promise.all([
        api.get("/students/"),
        api.get("/supervisors/"),
      ]);

      setStudents(studentsResponse.data);
      setSupervisors(supervisorsResponse.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load students and supervisors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSupervisorSelect = (studentId, supervisorId) => {
    setSelectedSupervisors((prev) => ({
      ...prev,
      [studentId]: supervisorId,
    }));
  };

  const handleAssign = async (studentId) => {
    const supervisorId = selectedSupervisors[studentId];

    if (!supervisorId) {
      setError("Please select a supervisor before assigning.");
      setSuccess("");
      return;
    }

    setSubmittingId(studentId);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/assign-supervisor/", {
        student_id: studentId,
        supervisor_id: supervisorId,
      });

      setSuccess(response.data.message || "Supervisor assigned successfully.");
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to assign supervisor.");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <DashboardLayout title="Manage Users">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-teal-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="mt-2 text-3xl font-bold text-teal-600">{students.length}</p>
          </div>

          <div className="rounded-xl border border-teal-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Supervisors</p>
            <p className="mt-2 text-3xl font-bold text-teal-600">{supervisors.length}</p>
          </div>

          <div className="rounded-xl border border-teal-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Students Assigned</p>
            <p className="mt-2 text-3xl font-bold text-teal-600">{assignedCount}</p>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Students</h2>
                <p className="text-sm text-gray-500">Assign each student to a supervisor from this table.</p>
              </div>
            </div>

            {loading ? (
              <p className="py-10 text-sm text-gray-500">Loading students...</p>
            ) : students.length === 0 ? (
              <p className="py-10 text-sm text-gray-500">No students found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-gray-600">
                      <th className="px-3 py-3 font-semibold">Student</th>
                      <th className="px-3 py-3 font-semibold">Course</th>
                      <th className="px-3 py-3 font-semibold">Year</th>
                      <th className="px-3 py-3 font-semibold">Current Supervisor</th>
                      <th className="px-3 py-3 font-semibold">Assign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-gray-100 align-top">
                        <td className="px-3 py-4">
                          <p className="font-semibold text-gray-800">{student.name || student.username}</p>
                          <p className="text-xs text-gray-500">@{student.username}</p>
                        </td>
                        <td className="px-3 py-4 text-gray-700">{student.course_title}</td>
                        <td className="px-3 py-4 text-gray-700">{student.year_of_study}</td>
                        <td className="px-3 py-4 text-gray-700">
                          {student.supervisor_name || "Not assigned"}
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex min-w-[250px] gap-2">
                            <select
                              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-teal-500"
                              value={selectedSupervisors[student.id] ?? student.assigned_supervisor ?? ""}
                              onChange={(e) => handleSupervisorSelect(student.id, e.target.value)}
                            >
                              <option value="">Select supervisor</option>
                              {supervisors.map((supervisor) => (
                                <option key={supervisor.id} value={supervisor.id}>
                                  {supervisor.name || supervisor.username}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              onClick={() => handleAssign(student.id)}
                              disabled={submittingId === student.id}
                              className="rounded-lg bg-teal-500 px-4 py-2 font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {submittingId === student.id ? "Saving..." : "Assign"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">Supervisors</h2>
            <p className="mt-1 text-sm text-gray-500">Available supervisors and their assignment load.</p>

            {loading ? (
              <p className="py-10 text-sm text-gray-500">Loading supervisors...</p>
            ) : supervisors.length === 0 ? (
              <p className="py-10 text-sm text-gray-500">No supervisors found.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {supervisors.map((supervisor) => (
                  <div
                    key={supervisor.id}
                    className="rounded-lg border border-gray-200 px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-800">{supervisor.name || supervisor.username}</p>
                        <p className="text-sm text-gray-500">{supervisor.department}</p>
                        <p className="text-xs text-gray-500">{supervisor.place_of_work}</p>
                      </div>
                      <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                        {supervisor.assigned_students_count || 0} students
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Users;
