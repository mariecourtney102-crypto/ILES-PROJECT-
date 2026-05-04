import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Components/dashboard_layout";
import { fetchSupervisorStudents } from "../../api/api";

export default function SupervisorAssignedStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchSupervisorStudents();
        setStudents(data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load assigned students.");
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  return (
    <DashboardLayout title="Assigned Students">
      <div className="space-y-6">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Assigned Students</p>
            <p className="mt-2 text-3xl font-bold text-teal-600">{students.length}</p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">With Placement Saved</p>
            <p className="mt-2 text-3xl font-bold text-teal-600">
              {students.filter((student) => student.placement).length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Without Placement</p>
            <p className="mt-2 text-3xl font-bold text-amber-500">
              {students.filter((student) => !student.placement).length}
            </p>
          </div>
        </div>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Student Details</h2>
            <p className="text-sm text-gray-500">
              View profile and internship placement details for students assigned to you.
            </p>
          </div>

          {loading ? (
            <p className="py-10 text-sm text-gray-500">Loading assigned students...</p>
          ) : students.length === 0 ? (
            <p className="py-10 text-sm text-gray-500">No students have been assigned to you yet.</p>
          ) : (
            <div className="space-y-4">
              {students.map((student) => (
                <div key={student.id} className="rounded-xl border border-gray-200 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{student.name || student.username}</h3>
                      <p className="text-sm text-gray-500">@{student.username}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        student.placement ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {student.placement ? "Placement added" : "Placement missing"}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">ID Number</p>
                      <p className="mt-1 text-sm text-gray-700">{student.ID_number}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Phone</p>
                      <p className="mt-1 text-sm text-gray-700">{student.telephone_number || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Course</p>
                      <p className="mt-1 text-sm text-gray-700">{student.course_title}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Year of Study</p>
                      <p className="mt-1 text-sm text-gray-700">Year {student.year_of_study}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">University</p>
                    <p className="mt-1 text-sm text-gray-700">{student.university_name}</p>
                  </div>

                  <div className="mt-5 rounded-xl bg-gray-50 p-4">
                    <p className="text-sm font-semibold text-gray-700">Internship Placement</p>
                    {student.placement ? (
                      <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Company</p>
                          <p className="mt-1 text-sm text-gray-700">{student.placement.place_of_internship}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Department</p>
                          <p className="mt-1 text-sm text-gray-700">{student.placement.department}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Site Supervisor</p>
                          <p className="mt-1 text-sm text-gray-700">{student.placement.supervisor_name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Duration</p>
                          <p className="mt-1 text-sm text-gray-700">
                            {student.placement.start_date} to {student.placement.end_date}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-gray-500">This student has not added internship placement details yet.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
