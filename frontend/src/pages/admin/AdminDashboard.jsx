
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
      
    </DashboardLayout>


  );
};

export default AdminDashboard;