import DashboardLayout from "../../Components/dashboard_layout";
import { useLogs } from "../../context/LogContext";
function SupervisorDashboard(){
    const {logs } = useLogs() ;
    const students = [...new Set(logs.map(l => l.studentName))];
    const totalStudents = students.length;
    const pending = logs.filter(l=> l.status === "pending").length;
    const reviewed = logs.filter (l => l.status === "reviewed").length;
    
    return (
    <DashboardLayout title="Supervisor Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded shadow ">
                <h3> Total Students</h3>
                <p className="text-2xl font-bold">{totalStudents}</p>
            </div>

            <div className="p-4 bg-white rounded shadow">
                <h3> Pending Reviews</h3>
                <p className="text-2xl text-yellow-500" >{pending}</p>
            </div>

            <div className="p-4 bg-white rounded shadow">
                <h3>Reviewed</h3>
                <p className="text-2xl text-green-500">{reviewed}</p>
            </div>

            <div className = " p-4 bg-white rounded shadow">
                <h3>semester</h3>
                <p> sem 2 - 2026</p>
            </div>

        </div>

    </DashboardLayout >);
};
export default SupervisorDashboard;

