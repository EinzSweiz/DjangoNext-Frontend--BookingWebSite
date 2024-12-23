"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useReviewModal from "@/app/hooks/useReviewModal";
import Modal from "./Modal";
import apiService from "@/app/services/apiService";
import { getUserId } from "@/app/lib/actions";
import useLoginModal from "@/app/hooks/useLoginModal";

const ReviewModal = () => {
    const reviewModal = useReviewModal();
    const { isOpen, review } = reviewModal; // Access modal state and selected review
    const [reason, setReason] = useState<string>("");
    const [feedbackMessage, setFeedbackMessage] = useState<string>(""); // Success/Failure message
    const [error, setError] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Submission state
    const [userId, setUserId] = useState<string | null>(null);
    const loginModal = useLoginModal()
    useEffect(() => {
        const fetchUserId = async () => {
            const id = await getUserId()
            setUserId(id)
        }
        fetchUserId()
    }, [])

    const handleSubmit = async () => {
        if (!review) {
            setError("No review selected.");
            return;
        }
        if (!userId) {
            setError("You need to be logged in to create a report.");
            setTimeout(() => {
                setReason('')
                reviewModal.close();
                setError('')
                loginModal.open();
            }, 2000); // Redirect to login modal after 1 second
            return;
        }

        if (!reason.trim()) {
            setError("Reason cannot be empty.");
            return;
        }

        setIsSubmitting(true); // Start submission
        setFeedbackMessage(""); // Clear any previous messages
        setError('');

        try {
            await apiService.postWithoutImages(
                `/api/reviews/report/create/${review.id}/`,
                { reason }
            );
            setFeedbackMessage("Your report was sent successfully.");
            setReason(""); // Reset the reason field

            // Wait for 3 seconds before closing the modal
            setTimeout(() => {
                reviewModal.close();
                setFeedbackMessage(""); // Clear feedback message
            }, 3000);
        } catch (error) {
            console.error("Failed to submit the report.", error);
            setError("Failed to send the report. Please try again.");
        } finally {
            setIsSubmitting(false); // End submission
        }
    };

    const content = (
        <Card className="w-full h-full p-6 max-w-4xl mx-auto bg-gray-900 text-gray-100 rounded-lg shadow-lg">
            <CardHeader>
                <CardDescription className="text-center mt-2 text-2xl text-gray-300">
                    {error && <span className="text-red-400">{error}</span>}
                    {feedbackMessage && <span className="text-green-400">{feedbackMessage}</span>}
                    {!error && !feedbackMessage && "Please provide a reason for reporting this review."}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-center space-y-4">
                <Input
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for reporting"
                    className="w-full max-w-lg bg-gray-800 text-gray-100 border-gray-600 placeholder-gray-500"
                    disabled={isSubmitting}
                    required
                />
                <div className="flex justify-center w-full mt-6">
                    <Button
                        type="button"
                        className={`w-full max-w-md py-3 text-lg font-bold rounded-lg ${
                            isSubmitting ? "bg-green-700" : "bg-black hover:bg-gray-800"
                        } text-white`}
                        onClick={handleSubmit}
                        disabled={isSubmitting} // Disable button while submitting
                    >
                        {isSubmitting ? "Submitting..." : "Report"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );    

    return (
        <Modal
            isOpen={isOpen}
            close={reviewModal.close}
            label="Report"
            content={content}
        />
    );
};

export default ReviewModal;
