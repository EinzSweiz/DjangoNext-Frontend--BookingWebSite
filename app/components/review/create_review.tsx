'use client';
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

      if (response) {
        setMessage("Review created successfully!");
        setText(""); // Clear the input field after successful submission
        setTimeout(() => {
            window.location.reload()
        }, 1000)
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error || "Unable to create review"}`);
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div style={{ backgroundColor: "#1E1E1E", padding: "20px", borderRadius: "10px", color: "#FFF", marginTop: "20px" }}>
      <h3 style={{ borderBottom: "1px solid #555", paddingBottom: "10px", marginBottom: "20px", fontSize: "18px" }}>
        Write a Review
      </h3>
      {message && (
        <p style={{ 
          color: message.startsWith("Review created") ? "#4CAF50" : "#F44336", 
          marginBottom: "10px", 
          fontSize: "14px" 
        }}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your review here..."
          rows={4}
          style={{
            width: "100%",
            backgroundColor: "#2A2A2A",
            border: "1px solid #555",
            borderRadius: "8px",
            padding: "10px",
            color: "#FFF",
            fontSize: "14px",
          }}
          required
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#4CAF50",
            color: "#FFF",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#45A049")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default CreateReview;
