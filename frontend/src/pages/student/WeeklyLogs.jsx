import DashboardLayout from "../../Components/dashboard_layout";
import { useLogs } from "../../context/LogContext";

function WeeklyLogs() {
  const { logs } = useLogs();

  return (
    <DashboardLayout title="Weekly Logs">
      <div className="flex flex-col gap-4">
        {logs.map((log, index) => (
          <div key={index} className="p-4 border rounded-lg flex justify-between">
            <span>Week {log.week}</span>
            <span className="text-yellow-500">{log.status}</span>
          </div>
        ))}

      </div>
    </DashboardLayout>
  );
}

export default WeeklyLogs;