import { Link } from "react-router-dom";
import DashboardLayout from "../../Components/dashboard_layout";

function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
          <p className="mt-2 text-sm text-gray-600">
            View all students and supervisors, then assign each student to the right supervisor.
          </p>
          <Link
            to="/admin/users"
            className="mt-5 inline-flex rounded-lg bg-teal-500 px-4 py-2 font-semibold text-white transition hover:bg-teal-600"
          >
            Open Users Page
          </Link>
        </div>

        <div className="rounded-xl border border-teal-100 bg-teal-50 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-teal-800">Assignment Workflow</h2>
          <p className="mt-2 text-sm text-teal-700">
            The admin dashboard now uses the backend student and supervisor endpoints so assignment can happen from the frontend.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
