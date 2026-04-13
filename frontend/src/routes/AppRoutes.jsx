import {BrowserRouter , Routes , Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import StudentDashboard from "../pages/student/StudentDashboard";
import SupervisorDashboard from "../pages/supervisor/SupervisorDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Sidebar from "../Components/Sidebar";
import SubmitLog from "../pages/student/SubmitLog";
import WeeklyLogs from "../pages/student/WeeklyLogs";
import InternshipDetails from "../pages/student/InternshipDetails";
const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path= "/" element = {<Login/>}/>
                <Route path= "/signup" element = {<Signup/>}/>
                <Route path= "/sidebar" element = {<Sidebar/>}/>
                <Route path= "/weeklylogs" element = {<WeeklyLogs/>}/>
                <Route path= "/submitlog" element = {<SubmitLog/>}/>
                <Route path= "/student" element = {<StudentDashboard/>}/>
                <Route path= "/supervisor" element = {<SupervisorDashboard/>}/>
                <Route path= "/admin" element = {<AdminDashboard/>}/>
                <Route path= "/student/internship-details" element = {<InternshipDetails/>}/>
            </Routes>
        </BrowserRouter>
    );
};
export default AppRoutes;