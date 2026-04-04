import {BrowserRouter , Routes , Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import StudentDashboard from "../pages/dashboards/StudentDashboard";
import SupervisorDashboard from "../pages/dashboards/SupervisorDashboard";
import AdminDashboard from "../pages/dashboards/AdminDashboard";
const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path= "/" element = {<Login/>}/>
                <Route path= "/signup" element = {<Signup/>}/>
                <Route path= "/student" element = {<StudentDashboard/>}/>
                <Route path= "/supervisor" element = {<SupervisorDashboard/>}/>
                <Route path= "admin/" element = {<AdminDashboard/>}/>
            </Routes>
        </BrowserRouter>
    );
};
export default AppRoutes;