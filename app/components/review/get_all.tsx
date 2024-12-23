'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import apiService from "@/app/services/apiService";
import ReviewDropdown from "./DropDown";
import useReviewModal from "@/app/hooks/useReviewModal";
import { getUserId } from "@/app/lib/actions";
import { useRouter } from "next/navigation";
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
    const router = useRouter()
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    const reviewModal = useReviewModal();

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await getUserId()
            setUserId(id)
        }
        fetchUserId()
    }, [])

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
                                <div style={{ marginRight: "15px", flexShrink: 0, width: "40px", height: "40px", overflow: "hidden", borderRadius: "50%", cursor: "pointer" }}
                                onClick={() => router.push(`/landlords/${review.user.id}`)}
                                >
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
                                <div style={{ flex: 1 }}>
                                    <p style={{ display: "flex", alignItems: "center", margin: "0 0 5px", fontSize: "16px", color: "#FFF" }}>
                                        <span style={{ fontWeight: "bold" }}>{review.user.name}</span>
                                        <span style={{ margin: "0 5px", color: "#888" }}>•</span>
                                        <small style={{ fontSize: "12px", color: "#888", fontStyle: "italic" }}>
                                            {new Date(review.created_at).toLocaleString()}
                                        </small>
                                    </p>
                                    <p style={{ margin: "0 0 5px", color: "#AAA", fontSize: "14px", lineHeight: "1.4" }}>
                                        {review.text}
                                    </p>
                                </div>
                                {userId && <ReviewDropdown onReport={() => reviewModal.open(review)} />}
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            )}
            {loading && <p>Loading more reviews...</p>}
            {currentPage < totalPages && !loading && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                    <button
                        onClick={loadMore}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#4CAF50",
                            color: "#FFF",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#45A049")}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
                    >
                        See More
                    </button>
                </div>
            )}
        </div>
    );
};

export default GetAllReviews;
