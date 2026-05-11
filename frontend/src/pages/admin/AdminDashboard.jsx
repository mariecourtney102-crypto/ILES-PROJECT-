import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "../../Components/dashboard_layout";
import { axiosInstance } from "../../api/api";
import { Users, Briefcase, CheckCircle, Award } from "lucide-react";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total_students: 0,
    total_supervisors: 0,
    active_internships: 0,
    completed_internships: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch admin dashboard stats
        const adminResponse = await axiosInstance.get("/admin/");
        
        // Fetch supervisors count
        const supervisorsResponse = await axiosInstance.get("/admin/supervisors/");

        const adminData = adminResponse.data;
        const supervisorCount = supervisorsResponse.data.length;

        // Calculate completed internships (total logs - pending logs)
        const completedInternships = adminData.total_logs - adminData.pending_logs;

        setStats({
          total_students: adminData.total_students,
          total_supervisors: supervisorCount,
          active_internships: adminData.total_placements,
          completed_internships: completedInternships,
        });
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load admin stats");
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Stat card component
  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`rounded-xl p-6 shadow-md border transition hover:shadow-lg ${color}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
        <Icon size={24} className={`${color.includes("blue") ? "text-blue-600" : color.includes("green") ? "text-green-600" : color.includes("purple") ? "text-purple-600" : "text-orange-600"}`} />
      </div>
      <p className={`text-4xl font-bold ${color.includes("blue") ? "text-blue-600" : color.includes("green") ? "text-green-600" : color.includes("purple") ? "text-purple-600" : "text-orange-600"}`}>
        {value}
      </p>
    </div>
  );

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="max-w-6xl space-y-8">
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p className="font-semibold">Error loading stats:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading dashboard statistics...</p>
          </div>
        )}

        {/* Stats Grid */}
        {!loading && (
          <>
            <div>
              <h2 className="text-xs uppercase font-semibold text-gray-600 mb-4">System Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={Users}
                  title="Total Students"
                  value={stats.total_students}
                  color="bg-blue-50 border-blue-200"
                />
                <StatCard
                  icon={Award}
                  title="Workplace Supervisors"
                  value={stats.total_supervisors}
                  color="bg-purple-50 border-purple-200"
                />
                <StatCard
                  icon={Briefcase}
                  title="Active Internships"
                  value={stats.active_internships}
                  color="bg-orange-50 border-orange-200"
                />
                <StatCard
                  icon={CheckCircle}
                  title="Completed Internships"
                  value={stats.completed_internships}
                  color="bg-green-50 border-green-200"
                />
              </div>
            </div>

            {/* Management Cards */}
            <div>
              <h2 className="text-xs uppercase font-semibold text-gray-600 mb-4">Quick Actions</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100 hover:shadow-lg transition">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    View all students and supervisors in the system, then assign each student to the appropriate supervisor.
                  </p>
                  <Link
                    to="/admin/users"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Users size={18} />
                    Manage Users
                  </Link>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-md border border-blue-200 hover:shadow-lg transition">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">System Stats</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Dashboard shows real-time statistics from your backend. All students, supervisors, and internship placements are tracked automatically.
                  </p>
                  <Link
                    to="/admin/reports"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                  >
                    <CheckCircle size={18} />
                    View Reports
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
