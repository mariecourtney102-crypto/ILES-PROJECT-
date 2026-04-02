import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () =>{
    const navigate = useNavigate();
    const {login} = useAuth();

    const [role, setRole] = useState("student");
    const [email, setEmail] = useState("");
    const [password , setPassword] =useState("");
    const [identifier, setIdentifier] = useState("");

    const handleSubmit = (e) =>{
        e.preventDefault();
        if (!email || !password || !identifier){
            alert("please fill all fields");
            return;
        }
        const userData = {
            role,
            email,
            identifier,
        };
        login(userData);
        if (role == "student") navigate("/student");
        if (role === "supervisor") navigate("/supervisor");
        if (role === "admin") navigate("/admin");
    };
    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
          <h2>ILES Login</h2>
          <form onSubmit={handleSubmit}>
            <select onChange={(e) => setRole(e.target.value) }>
                <option value = "student ">Student</option>
                <option value = "supervisor ">Supervisor</option>
                <option value = "admin ">Admin</option>
            </select>

            <input 
            type = "email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            />
            <input 
            type="password"
            placeholder="Password"
            onchange = {(e) => setPassword(e.target.value) }/>

            {role === "Student" && (
                <input
                  type="text"
                  placeholder="Student Number"
                  onChange={(e) => setIdentifier (e.target.value)}
                />
                )}
            {role === "supervisor" && (
                <input
                  type="text"
                  placeholder="Staff ID"
                  onChange={(e) => setIdentifier(e.target.value)}
                />
            )}
            {role === "admin" && (
          <input
            type="text"
            placeholder="Admin Code"
            onChange={(e) => setIdentifier(e.target.value)}
          />
        )}
           <button type="submit">Login</button>
          </form>
        </div>
    );
};
export default Login;