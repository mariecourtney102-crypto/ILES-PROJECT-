import { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/users/")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-teal-600 mb-4">
        Users
      </h1>

      <div className="bg-white p-4 rounded-lg shadow">
        {users.map(user => (
          <div key={user.id} className="border-b py-2">
            {user.name} - {user.email}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;