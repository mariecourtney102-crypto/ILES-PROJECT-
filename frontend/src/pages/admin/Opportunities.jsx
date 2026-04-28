import { useEffect, useState } from "react";
import axios from "axios";

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/opportunities/")
      .then(res => setOpportunities(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-teal-600 mb-4">
        Reports
      </h1>

      <div className="bg-white p-4 rounded-lg shadow">
        {opportunities.length > 0 ? (
          opportunities.map(opportunities => (
            <div key={opportunities.id} className="border-b py-3">
              <p className="font-semibold">{opportunities.title}</p>
              <p className="text-gray-600">{opportunities.summary}</p>
              <p className="text-sm text-gray-400">
                Date: {opportunities.created_at}
              </p>
            </div>
          ))
        ) : (
          <p>No opportunities available.</p>
        )}
      </div>
    </div>
  );
};

export default Opportunities;