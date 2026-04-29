import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // 🔄 FETCH USERS
  const fetchUsers = () => {
    axios.get("http://localhost:8000/api/admin/users/")
      .then(res => {
        setUsers(res.data);
        setFilteredUsers(res.data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔍 FILTER LOGIC
  useEffect(() => {
    let data = [...users];

    if (search) {
      data = data.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      data = data.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      data = data.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(data);
  }, [search, roleFilter, statusFilter, users]);

  // ❌ DELETE USER
  const handleDelete = (id) => {
    if (!confirm("Delete this user?")) return;

    axios.delete(`http://localhost:8000/api/admin/users/${id}/`)
      .then(() => fetchUsers())
      .catch(err => console.error(err));
  };

  // 🔁 TOGGLE STATUS
  const toggleStatus = (user) => {
    const newStatus = user.status === "active" ? "disabled" : "active";

    axios.patch(`http://localhost:8000/api/admin/users/${user.id}/`, {
      status: newStatus,
    })
      .then(() => fetchUsers())
      .catch(err => console.error(err));
  };

  // 📊 STATS
  const total = users.length;
  const students = users.filter(u => u.role === "student").length;
  const supervisors = users.filter(u => u.role === "supervisor").length;
  const pending = users.filter(u => u.status === "pending").length;

  // 🎨 BADGE STYLES
  const roleStyle = (role) => {
    if (role === "student") return "bg-gray-100 text-gray-600";
    if (role === "supervisor") return "bg-teal-100 text-teal-700";
    if (role === "admin") return "bg-purple-100 text-purple-700";
  };

  const statusStyle = (status) => {
    if (status === "active") return "bg-green-100 text-green-600";
    if (status === "pending") return "bg-yellow-100 text-yellow-600";
    if (status === "disabled") return "bg-red-100 text-red-600";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* 🔥 HEADER */}
      <h1 className="text-2xl font-semibold mb-6">Users</h1>

      {/* 📊 STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Users</p>
          <h2 className="text-xl font-semibold">{total}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Students</p>
          <h2 className="text-xl font-semibold">{students}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Supervisors</p>
          <h2 className="text-xl font-semibold">{supervisors}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Pending</p>
          <h2 className="text-xl font-semibold">{pending}</h2>
        </div>
      </div>

      {/* 🔍 FILTER BAR */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search users..."
          className="border p-2 rounded-lg w-64 focus:ring-2 focus:ring-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded-lg"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="supervisor">Supervisors</option>
          <option value="admin">Admins</option>
        </select>

        <select
          className="border p-2 rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>

      {/* 👥 TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Supervisor</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{user.username}</td>
                <td>{user.email}</td>

                <td>
                  <span className={`px-2 py-1 rounded-lg text-sm ${roleStyle(user.role)}`}>
                    {user.role}
                  </span>
                </td>

                <td>
                  <span className={`px-2 py-1 rounded-lg text-sm ${statusStyle(user.status)}`}>
                    {user.status}
                  </span>
                </td>

                <td>
                  {user.supervisor_name || (
                    <span className="text-gray-400 text-sm">Not assigned</span>
                  )}
                </td>

                <td className="flex gap-2 py-2">
                  <button
                    onClick={() => toggleStatus(user)}
                    className="text-sm text-primary hover:underline"
                  >
                    {user.status === "active" ? "Disable" : "Activate"}
                  </button>

                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <p className="text-center text-gray-400 py-6">No users found</p>
        )}
      </div>
    </div>
  );
}