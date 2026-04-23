import {BrowserRouter , Routes , Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import UserFeedback from "../pages/student/UserFeedback";
import StudentDashboard from "../pages/student/StudentDashboard";
import SupervisorDashboard from "../pages/supervisor/SupervisorDashboard";
import SupervisorAssignedStudents from "../pages/supervisor/SupervisorAssignedStudents";
import SupervisorFeedback from "../pages/supervisor/SupervisorFeedback";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminSettings from "../pages/admin/Settings";
import SubmitLog from "../pages/student/SubmitLog";
import WeeklyLogs from "../pages/student/WeeklyLogs";
import InternshipDetails from "../pages/student/InternshipDetails";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path= "/" element = {<Login/>}/>
                <Route path= "/signup" element = {<Signup/>}/>
                <Route path= "/weeklylogs" element = {<ProtectedRoute requiredRole="student"><WeeklyLogs/></ProtectedRoute>}/>
                <Route path= "/submitlog" element = {<ProtectedRoute requiredRole="student"><SubmitLog/></ProtectedRoute>}/>
                <Route path= "/student" element = {<ProtectedRoute requiredRole="student"><StudentDashboard/></ProtectedRoute>}/>
                <Route path= "/supervisor" element = {<ProtectedRoute requiredRole="supervisor"><SupervisorDashboard/></ProtectedRoute>}/>
                <Route path= "/supervisor/assigned-students" element = {<ProtectedRoute requiredRole="supervisor"><SupervisorAssignedStudents/></ProtectedRoute>}/>
                <Route path= "/supervisor/feedback" element = {<ProtectedRoute requiredRole="supervisor"><SupervisorFeedback/></ProtectedRoute>}/>
                <Route path= "/admin" element = {<ProtectedRoute requiredRole="admin"><AdminDashboard/></ProtectedRoute>}/>
                <Route path= "/admin/settings" element = {<ProtectedRoute requiredRole="admin"><AdminSettings/></ProtectedRoute>}/>
                <Route path= "/student/feedback" element = {<ProtectedRoute requiredRole="student"><UserFeedback/></ProtectedRoute>}/>
                <Route path= "/student/internship-details" element = {<ProtectedRoute requiredRole="student"><InternshipDetails/></ProtectedRoute>}/>
            </Routes>
        </BrowserRouter>
    );
};
export default AppRoutes;