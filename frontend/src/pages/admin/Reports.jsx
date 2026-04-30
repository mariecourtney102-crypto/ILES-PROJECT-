import { useEffect, useState } from "react";
import api from "../../api/api";

const Reports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.get("/reports/")
      .then(res => setReports(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-teal-600 mb-4">
        Reports
      </h1>

      <div className="bg-white p-4 rounded-lg shadow">
        {reports.length > 0 ? (
          reports.map(report => (
            <div key={report.id} className="border-b py-3">
              <p className="font-semibold">{report.title}</p>
              <p className="text-gray-600">{report.summary}</p>
              <p className="text-sm text-gray-400">
                Date: {report.created_at}
              </p>
            </div>
          ))
        ) : (
          <p>No reports available.</p>
        )}
      </div>
    </div>
  );
};

export default Reports;
