import {BrowserRouter , Routes , Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import UserFeedback from "../pages/student/UserFeedback";
import StudentDashboard from "../pages/student/StudentDashboard";
import SupervisorDashboard from "../pages/supervisor/SupervisorDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
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
                <Route path= "/weeklylogs" element = {<WeeklyLogs/>}/>
                <Route path= "/submitlog" element = {<ProtectedRoute><SubmitLog/></ProtectedRoute>}/>
                <Route path= "/student" element = {<ProtectedRoute><StudentDashboard/></ProtectedRoute>}/>
                <Route path= "/supervisor" element = {<ProtectedRoute><SupervisorDashboard/></ProtectedRoute>}/>
                <Route path= "/admin" element = {<ProtectedRoute><AdminDashboard/></ProtectedRoute>}/>
                <Route path= "/student/feedback" element = {<ProtectedRoute><UserFeedback/></ProtectedRoute>}/>
                <Route path= "/student/internship-details" element = {<ProtectedRoute><InternshipDetails/></ProtectedRoute>}/>
            </Routes>
        </BrowserRouter>
    );
};
export default AppRoutes;