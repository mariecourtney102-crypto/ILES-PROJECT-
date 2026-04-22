import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/choose-role/")
      .then((res) => {
        setRoles(res.data.available_roles);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSelectRole = (role) => {
    console.log("Selected role:", role);
  };

  

  
}

export default App;
axios.post("http://127.0.0.1:8000/api/choose-role/", {
  role: role
});