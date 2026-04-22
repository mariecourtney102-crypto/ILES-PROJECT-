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
    axios.post("http://127.0.0.1:8000/api/choose-role/" , {
      role : role
    })
    .then(res => console.log(res.data))

  };

  return (
    <div>
      <h1>Select Role</h1>
      {roles.length === 0 ? (
        <p> Loading roles ...</p>
      ) : (
        roles.map ((role,index) => (
          <button key = {index} onClick={() => handleSelectRole (role)}>
            {role}
          </button>
        ))
      )}
    </div>

  );

  
}

export default App;
