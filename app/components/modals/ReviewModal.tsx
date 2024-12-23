"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useReviewModal from "@/app/hooks/useReviewModal";
import Modal from "./Modal";
import apiService from "@/app/services/apiService";

const ReviewModal = () => {
    const reviewModal = useReviewModal();
    const { isOpen, review } = reviewModal; // Access modal state and selected review
    const [reason, setReason] = useState<string>("");
    const [feedbackMessage, setFeedbackMessage] = useState<string>(""); // Success/Failure message
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Submission state

    const handleSubmit = async () => {
        if (!review) {
            setFeedbackMessage("No review selected.");
            return;
        }

        setIsSubmitting(true); // Start submission
        setFeedbackMessage(""); // Clear any previous messages

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
            setFeedbackMessage("Failed to send the report. Please try again.");
        } finally {
            setIsSubmitting(false); // End submission
        }
    };

    const content = (
        <Card className="w-full h-full p-6 max-w-4xl mx-auto bg-gray-900 text-gray-100 rounded-lg shadow-lg">
            <CardHeader>
                <CardDescription className="text-center mt-2 text-2xl text-gray-300">
                    {feedbackMessage ? (
                        <span className="text-green-400">{feedbackMessage}</span>
                    ) : (
                        "Please provide a reason for reporting this review."
                    )}
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
