
import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/admin/dashboard/')
      .then(res => res.json())
      .then(data => console.log('Data received:', data))
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-teal-600 mb-4">
        Dashboard
      </h1>

      <div className="bg-white p-4 rounded-lg shadow">
        {stats ? (
          <pre>{JSON.stringify(stats, null, 2)}</pre>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;