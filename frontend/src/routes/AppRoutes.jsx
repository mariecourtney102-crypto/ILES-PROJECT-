import {BrowserRouter , Routes , Route } from "react-router-dom";
import Login from "../pages/auth/Login";
const StudentDashhboard = () =>  <h1>Student Dashboard</h1>
const SupervisorDashboard = () =>  <h1>Supervisor Dashboard</h1>
const AdmiDashboard= () =>  <h1>Admin Dashboard</h1>

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path= "/" element = {<Login/>}/>
                <Route path= "/student" element = {<StudentDashhboard/>}/>
                <Route path= "/supervisor" element = {<SupervisorDashboard/>}/>
                <Route path= "admin/" element = {<AdmiDashboard/>}/>
            </Routes>
        </BrowserRouter>
    );
};
export default AppRoutes;