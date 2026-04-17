import DashboardLayout from "../../Components/dashboard_layout";
import { useLogs } from "../../context/LogContext";

function StudentDashboard() {
  const { logs } = useLogs();
  const drafts = logs.filter(l => l.status === "draft").length
  const pending = logs.filter(l => l.status === "pending").length
  const reviewed = logs.filter(l => l.status === "reviwed" && l.supervisorComment).length;

  return (
    <DashboardLayout title = "Student Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
        {/*drafts*/}
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-gray-500">Draft Logs</h3>
          <p className="text-2xl font-bold text-gray-700">{drafts}</p>
        </div>

         {/* Pending  */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-gray-500">Pending Logs</h3>
          <p className="text-2xl font-bold text-yellow-500">{pending}</p>
        </div>

        {/*reviewed*/}
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-gray-500"> Reviewed Logs</h3>
          <p className="text-2xl font-bold text-green-500">{reviewed}</p>
        </div>

      </div>
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2"> Recent Logs</h3>
        {logs.slice (0,5).map((log, index) => (
          <div key = {index} className="border-b py-2">
            <p >{log.description}</p>
            <span className="text-sm text-gray-500">{log.status}</span>
          </div>
        ))} 
      </div>
    </DashboardLayout>
  );

}
export default StudentDashboard;