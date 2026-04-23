import React, { useState } from "react";
import DashboardLayout from "../../Components/dashboard_layout";

const UserFeedback = () => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    rating: 0,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRating = (value) => {
    setFormData({ ...formData, rating: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Feedback submitted:", formData);

    // Reset form
    setFormData({
      subject: "",
      message: "",
      rating: 0,
    });
  };

  return (
    <DashboardLayout title="Feedback">
      <div className="w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-teal-600 mb-6">
        Feedback Form
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5"
      >
        {/* Subject */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enter subject"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your feedback..."
            rows="4"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
            required
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => handleRating(star)}
                className={`text-2xl transition ${
                  formData.rating >= star
                    ? "text-teal-600"
                    : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          Submit Feedback
        </button>
      </form>
      </div>

    </DashboardLayout>
  );
};

export default UserFeedback;


