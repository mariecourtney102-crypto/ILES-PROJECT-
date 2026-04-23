import React from "react";
import DashboardLayout from "../../Components/dashboard_layout";
import { MessageSquare } from "lucide-react";

export default function SupervisorFeedback() {
  return (
    <DashboardLayout title="Feedback">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MessageSquare size={24} className="text-teal-600" />
          Recent Feedback from Students
        </h2>
        <div className="space-y-4">
          {/* Empty - no feedback items */}
        </div>
        <p className="text-gray-500 text-center py-6">No feedback received yet</p>
      </div>
    </DashboardLayout>
  );
}
