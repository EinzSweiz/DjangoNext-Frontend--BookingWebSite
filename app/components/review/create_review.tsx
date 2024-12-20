'use client'
import apiService from "@/app/services/apiService";
import React, { useState } from "react";

const CreateReview = ({ propertyId }: { propertyId: string }) => {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiService.postWithoutImages(
        `/api/reviews/create/${propertyId}`,
        { text }
      );

      if (response.ok) {
        setMessage("Review created successfully!");
        setText(""); // Clear the input field after successful submission
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error || "Unable to create review"}`);
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      {message && <p className="text-sm text-red-500 mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your review here..."
          rows={4}
          className="w-full border border-gray-300 rounded-lg p-2"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default CreateReview;
