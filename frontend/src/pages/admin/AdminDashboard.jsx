
import { useEffect, useState } from "react";
import api from "../../api/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);
    console.log("User from localStorage:", localStorage.getItem("user"));
    
    api.get('/admin/dashboard/')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Full error:', err);
        console.error('Response:', err.response);
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-teal-600 mb-4">
        Dashboard
      </h1>

      <div className="bg-white p-4 rounded-lg shadow">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-gray-600">Students</p>
              <p className="text-2xl font-bold">{stats.total_students}</p>
            </div>
            <div className="p-4 bg-green-100 rounded-lg">
              <p className="text-sm text-gray-600">Supervisors</p>
              <p className="text-2xl font-bold">{stats.total_supervisors}</p>
            </div>
            <div className="p-4 bg-purple-100 rounded-lg">
              <p className="text-sm text-gray-600">Placements</p>
              <p className="text-2xl font-bold">{stats.total_placements}</p>
            </div>
            <div className="p-4 bg-yellow-100 rounded-lg">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold">{stats.pending_placements}</p>
            </div>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;