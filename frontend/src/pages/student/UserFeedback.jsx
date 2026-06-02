import React, { useState } from "react";
import DashboardLayout from "../../Components/dashboard_layout";
import api from "../../api/api";

const UserFeedback = () => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    rating: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRating = (value) => {
    setFormData({ ...formData, rating: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await api.post("/feedback/", formData);
      setSuccess("Feedback submitted successfully.");
      setFormData({
        subject: "",
        message: "",
        rating: 0,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Feedback">
      <div className="w-full max-w-2xl">
      <h2 className="mb-6 text-2xl font-bold text-[#0a7c6e]">
        Feedback Form
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5"
      >
        {/* Subject */}
        <div>
          <label className="mb-1 block text-sm text-gray-600">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enter subject"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-[#0d9e8c] focus:ring-2 focus:ring-[#0d9e8c]"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="mb-1 block text-sm text-gray-600">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your feedback..."
            rows="4"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-[#0d9e8c] focus:ring-2 focus:ring-[#0d9e8c]"
            required
          />
        </div>

        {/* Rating */}
        <div>
          <label className="mb-2 block text-sm text-gray-600">
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
                    ? "text-[#0a7c6e]"
                    : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        {success ? (
          <p className="rounded-lg border border-[#c7f2e8] bg-[#f1fbf8] px-3 py-2 text-sm text-[#065f52]">{success}</p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-[#0a7c6e] py-2 text-white transition hover:bg-[#065f52] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
      </div>

    </DashboardLayout>
  );
};

export default UserFeedback;


