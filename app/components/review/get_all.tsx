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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchReviews = async (page: number) => {
        try {
            setLoading(true);
            const data = await apiService.get(`/api/reviews/all/${propertyId}?page=${page}&page_size=5`);
            setReviews((prevReviews) => (page === 1 ? data.reviews : [...prevReviews, ...data.reviews]));
            setTotalPages(data.total_pages);
        } catch (err) {
            setError("Failed to fetch reviews.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews(currentPage);
    }, [propertyId, currentPage]);

    const loadMore = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div style={{ backgroundColor: "#1E1E1E", padding: "20px", borderRadius: "10px", color: "#FFF" }}>
            <h2 style={{ borderBottom: "1px solid #555", paddingBottom: "10px", marginBottom: "20px" }}>Reviews</h2>
            {reviews.length === 0 && !loading ? (
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
                                <div style={{ marginRight: "15px", flexShrink: 0, width: "40px", height: "40px", overflow: "hidden", borderRadius: "50%" }}>
                                    <Image
                                        src={review.user.avatar_url || "/default-avatar.png"}
                                        alt={review.user.name}
                                        width={40}
                                        height={40}
                                        style={{
                                            objectFit: "cover",
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    />
                                </div>
                                <div>
                                    <p style={{ fontWeight: "bold", margin: "0 0 5px", fontSize: "16px", color: "#FFF" }}>
                                        {review.user.name}
                                    </p>
                                    <p style={{ margin: "0 0 5px", color: "#AAA", fontSize: "14px", lineHeight: "1.4" }}>
                                        {review.text}
                                    </p>
                                    <small style={{ fontSize: "12px", color: "#888", fontStyle: "italic" }}>
                                        {new Date(review.created_at).toLocaleString()}
                                    </small>
                                </div>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            )}
            {loading && <p>Loading more reviews...</p>}
            {currentPage < totalPages && !loading && (
                <button
                    onClick={loadMore}
                    style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        backgroundColor: "#4CAF50",
                        color: "#FFF",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Load More
                </button>
            )}
        </div>
    );
};

export default GetAllReviews;
