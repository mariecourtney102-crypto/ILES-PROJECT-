import { useState } from "react";
import DashboardLayout from "../../Components/dashboard_layout";
import { useLogs } from "../../context/LogContext";

function SubmitLog() {
  const { addLog } = useLogs();

  const [week, setWeek] = useState("");
  const [description, setDescription] = useState("");
  const [challenges, setChallenges] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    
    if (week <= 0) {
      alert("Week number must be greater than 0");
      return;
    }

    const newLog = {
      week,
      description,
      challenges,
      dateSubmitted: new Date().toLocaleDateString(),
    };

    // Save as draft if missing important fields
    if (week === " " || description.trim() === "") {
      addLog({ ...newLog, status: "draft" });
      alert("Saved as draft. Please complete later.");
      return;
    }

    // Submit as pending
    addLog({ ...newLog, status: "pending" });
    alert("Log submitted successfully!");

    // Reset form
   
  };

  return (
    <DashboardLayout title="Submit Log">

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">

        <input
          type="number"
          placeholder="Week Number"
          value={week}
          onChange={(e) => setWeek(e.target.value)}
          className="p-3 border rounded-lg"
          min="1" 
        />

        <textarea
          placeholder="Describe tasks accomplished"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-3 border rounded-lg"
        />

        <textarea
          placeholder="Challenges faced (optional)"
          value={challenges}
          onChange={(e) => setChallenges(e.target.value)}
          className="p-3 border rounded-lg"
        />

        <button className="bg-teal-500 text-white p-3 rounded-lg">
          Submit Log
        </button>

      </form>

    </DashboardLayout>
  );
}

export default SubmitLog;