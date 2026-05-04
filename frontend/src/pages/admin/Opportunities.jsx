import { useEffect, useState } from "react";
import api from "../../api/api";

const Opportunities = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.get("/opportunities/")
      .then(res => setReports(res.data))
      .catch(err => console.error(err));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-teal-700">Opportunities</h1>

      <div className="mt-4 bg-white p-4 rounded shadow">
        {opportunities.length === 0 ? (
          <p>No opportunities found.</p>
        ) : (
          opportunities.map((opp) => (
            <div key={opp.id} className="border-b py-2">
              <p className="font-semibold">{opp.title}</p>
              <p className="text-sm text-gray-500">{opp.company}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Opportunities;
