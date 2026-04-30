import { useEffect, useState } from "react";
import api from "../../api/api";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    api.get("/feedback/")
      .then(res => setFeedbacks(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-teal-600 mb-4">
        Feedback
      </h1>

      <div className="bg-white p-4 rounded-lg shadow">
        {feedbacks.map(fb => (
          <div key={fb.id} className="mb-3">
            <p className="font-semibold">{fb.subject}</p>
            <p className="text-gray-600">{fb.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
