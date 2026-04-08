import { useState } from "react";
import DashboardLayout from "../../Components/dashboard_layout";
import { useLogs } from "../../context/LogContext";

function SubmitLog() {
  const { addLog } = useLogs();

  const [week, setWeek] = useState("");
  const [tasks, setTasks] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!week || !tasks) {
      alert("Fill all fields");
      return;
    }

    addLog({ week, tasks });

    setWeek("");
    setTasks("");
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
        />

        <textarea
          placeholder="Tasks done"
          value={tasks}
          onChange={(e) => setTasks(e.target.value)}
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