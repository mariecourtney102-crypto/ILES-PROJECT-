
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../Components/dashboard_layout";
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/admin/dashboard/')
      .then(res => res.json())
      .then(data => console.log('Data received:', data))
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <DashboardLayout>
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
    </DashboardLayout>


  );
};

export default AdminDashboard;