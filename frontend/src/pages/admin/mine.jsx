import { useEffect, useState } from "react";

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/opportunities/")
      .then(res => setOpportunities(res.data))
      .catch(err => console.error(err));
  }, []);
    // Replace with your API later
    setOpportunities([
      { id: 1, title: "Software Internship", company: "MTN Uganda" },
      { id: 2, title: "Data Analyst Role", company: "Airtel" },
    ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-teal-700">Opportunities</h1>

      <div className="mt-4 bg-white p-4 rounded shadow">
        {opportunities.length === 0 ? (
          <p>No opportunities available.</p>
        ) : (
          <ul className="space-y-3">
            {opportunities.map((opp) => (
              <li key={opp.id} className="border-b pb-2">
                <p className="font-semibold">{opp.title}</p>
                <p className="text-gray-500 text-sm">{opp.company}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Opportunities;