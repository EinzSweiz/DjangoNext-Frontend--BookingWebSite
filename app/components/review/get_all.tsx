'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import apiService from "@/app/services/apiService";

interface User {
    id: string;
    name: string;
    avatar_url: string;
}

interface Review {
  id: string;
  user: User;
  text: string;
  created_at: string;
}

const GetAllReviews = ({ propertyId }: { propertyId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await apiService.get(`/api/reviews/all/${propertyId}`);
        console.log(data)
        setReviews(data);
      } catch (err: any) {
        setError("Failed to fetch reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [propertyId]);

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          <AnimatePresence>
            {reviews.map((review) => (
              <motion.li
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  backgroundColor: "#f9f9f9",
                  margin: "10px 0",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
                }}
              >
                <p>
                  <strong>{review.user.name}</strong>: {review.text}
                </p>
                <small>{new Date(review.created_at).toLocaleString()}</small>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

export default GetAllReviews;
