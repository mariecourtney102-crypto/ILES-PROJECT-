import DashboardLayout from "../../Components/dashboard_layout";
import { useLogs } from "../../context/LogContext";

function WeeklyLogs() {
  const { logs } = useLogs();
  if (!logs || logs.length === 0) {
    return (
      <DashboardLayout title="Weekly Logs">
        <p className="text-gray-500">No logs available yet.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Weekly Logs">
      <div className="flex flex-col gap-4">
        {logs.map((log, index) => (
          <div key={index} className="p-4 border rounded-lg flex justify-between">
            <span>Week {log.week}</span>
            <p className="text-gray-700">{log.description}</p>
            <span>
              className={`
              ${log.status === "pending" && "text-yellow-500"}
              ${log.status === "reviewed"&& " text-green-500"}
              ${log.status === "draft" && "text-gray-500"}              
              `}
             {log.status}
            </span>         
            
          </div>
          ))}

      </div>
      
    </DashboardLayout>
  );
}

export default WeeklyLogs;