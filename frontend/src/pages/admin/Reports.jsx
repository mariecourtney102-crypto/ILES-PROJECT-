import { useEffect, useState } from "react";
import axiosInstance from "../../api/api";

function Reports() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axiosInstance.get("/admin/reports/");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReports();
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-teal-700">Reports</h1>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-white p-4 rounded shadow">
          Students: {stats.students}
        </div>
        <div className="bg-white p-4 rounded shadow">
          Supervisors: {stats.supervisors}
        </div>
        <div className="bg-white p-4 rounded shadow">
          Opportunities: {stats.opportunities}
        </div>
      </div>
    </div>
  );
}

export default Reports;