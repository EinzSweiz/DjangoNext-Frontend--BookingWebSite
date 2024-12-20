'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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
        <div style={{ backgroundColor: "#1E1E1E", padding: "20px", borderRadius: "10px", color: "#FFF" }}>
            <h2 style={{ borderBottom: "1px solid #555", paddingBottom: "10px", marginBottom: "20px" }}>Reviews</h2>
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
                                    display: "flex",
                                    alignItems: "center",
                                    margin: "10px 0",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    backgroundColor: "#2A2A2A",
                                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                                }}
                            >
                                <Image
                                        fill
                                        src={review.user.avatar_url || "/default-avatar.png"}
                                        alt={review.user.name}
                                        className="object-cover rounded-full"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                <div>
                                    <p style={{ fontWeight: "bold", margin: "0 0 5px" }}>{review.user.name}</p>
                                    <p style={{ margin: "0", color: "#DDD" }}>{review.text}</p>
                                    <small style={{ fontSize: "12px", color: "#888" }}>
                                        {new Date(review.created_at).toLocaleString()}
                                    </small>
                                </div>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            )}
        </div>
    );
};

export default GetAllReviews;
