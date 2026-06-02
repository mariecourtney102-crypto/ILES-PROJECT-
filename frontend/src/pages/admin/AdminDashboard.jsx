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
  const StatCard = ({ icon: Icon, title, value, className, iconClassName, valueClassName }) => (
    <div className={`rounded-xl border p-6 shadow-md transition hover:shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
        <Icon size={24} className={iconClassName} />
      </div>
      <p className={`text-4xl font-bold ${valueClassName}`}>
        {value}
      </p>
    </div>
  );

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="max-w-6xl space-y-8">
        
        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-700">
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
              <h2 className="text-xs uppercase font-semibold text-[#0a7c6e] mb-4">System Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={Users}
                  title="Total Students"
                  value={stats.total_students}
                  className="border-[#c7f2e8] bg-[#f1fbf8]"
                  iconClassName="text-[#0a7c6e]"
                  valueClassName="text-[#0a7c6e]"
                />
                <StatCard
                  icon={Award}
                  title="Workplace Supervisors"
                  value={stats.total_supervisors}
                  className="border-[#c7f2e8] bg-[#ecfdf5]"
                  iconClassName="text-[#3db88a]"
                  valueClassName="text-[#3db88a]"
                />
                <StatCard
                  icon={Briefcase}
                  title="Active Internships"
                  value={stats.active_internships}
                  className="border-[#c7f2e8] bg-white"
                  iconClassName="text-[#0d9e8c]"
                  valueClassName="text-[#0d9e8c]"
                />
                <StatCard
                  icon={CheckCircle}
                  title="Completed Internships"
                  value={stats.completed_internships}
                  className="border-[#c7f2e8] bg-[#f1fbf8]"
                  iconClassName="text-[#0a7c6e]"
                  valueClassName="text-[#0a7c6e]"
                />
              </div>
            </div>

            {/* Management Cards */}
            <div>
              <h2 className="text-xs uppercase font-semibold text-[#0a7c6e] mb-4">Quick Actions</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100 hover:shadow-lg transition">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    View all students and supervisors in the system, then assign each student to the appropriate supervisor.
                  </p>
                  <Link
                    to="/admin/users"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0a7c6e] px-4 py-2 font-semibold text-white transition hover:bg-[#065f52]"
                  >
                    <Users size={18} />
                    Manage Users
                  </Link>
                </div>

                <div className="rounded-xl border border-[#c7f2e8] bg-gradient-to-br from-[#f1fbf8] to-[#ecfdf5] p-6 shadow-md transition hover:shadow-lg">
                  <h3 className="text-lg font-semibold text-[#0a7c6e] mb-2">System Stats</h3>
                  <p className="text-sm text-slate-700 mb-4">
                    Dashboard shows real-time statistics from your backend. All students, supervisors, and internship placements are tracked automatically.
                  </p>
                  <Link
                    to="/admin/reports"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0a7c6e] px-4 py-2 font-semibold text-white transition hover:bg-[#065f52]"
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
