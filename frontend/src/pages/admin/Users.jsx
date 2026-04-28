import { useEffect, useState } from "react";
import axiosInstance from "../../api/api";

function Users() {
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [studentsRes, supervisorsRes] = await Promise.all([
          axiosInstance.get("/admin/students/"),
          axiosInstance.get("/admin/supervisors/"),
        ]);

        setStudents(studentsRes.data);
        setSupervisors(supervisorsRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-teal-700">Users</h1>

      {/* Tabs */}
      <div className="flex gap-4 mt-4">
        <button onClick={() => setActiveTab("students")}>
          Students
        </button>
        <button onClick={() => setActiveTab("supervisors")}>
          Supervisors
        </button>
      </div>

      <div className="mt-4 bg-white p-4 rounded shadow">
        {activeTab === "students" &&
          students.map((s) => (
            <div key={s.id} className="border-b py-2">
              <p>{s.name}</p>
              <p className="text-sm text-gray-500">{s.reg_no}</p>
            </div>
          ))}

        {activeTab === "supervisors" &&
          supervisors.map((s) => (
            <div key={s.id} className="border-b py-2">
              <p>{s.name}</p>
              <p className="text-sm text-gray-500">{s.department}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Users;