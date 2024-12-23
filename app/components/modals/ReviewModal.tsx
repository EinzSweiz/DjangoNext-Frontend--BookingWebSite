'use client'

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import useReviewModal from "@/app/hooks/useReviewModal";
import Modal from "./Modal";

interface ModalProps {
    isOpen: boolean;
    close: () => void;
    label: string;
    reviewId: string | null; // ID of the review being reported
    onSubmit: (reviewId: string, reason: string) => Promise<void>; // Callback for submission
}

const ReviewModal: React.FC<ModalProps> = ({ isOpen, close, label, reviewId, onSubmit }) => {
    const [showModal, setShowModal] = useState(isOpen);
    const [reason, setReason] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const reviewModal = useReviewModal()

    useEffect(() => {
        if (isOpen) {
            setShowModal(true);
        } else {
            setTimeout(() => {
                setShowModal(false);
                setReason(''); // Clear reason when modal closes
                setErrors(null); // Clear errors
            }, 300);
        }
    }, [isOpen]);

    const handleClose = useCallback(() => {
        close();
        setShowModal(false);
    }, [close]);

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleSubmit = async () => {
        if (!reviewId) return;

        if (!reason.trim()) {
            setErrors("Please provide a reason for reporting.");
            return;
        }

        setLoading(true);
        try {
            await onSubmit(reviewId, reason.trim());
            setSuccessMessage("Your report has been submitted successfully.");
            setTimeout(() => {
                setSuccessMessage(null);
                handleClose();
            }, 2000);
        } catch (error) {
            setErrors("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!showModal && !isOpen) return null;

    const content =  (
        <div className="flex items-center justify-center fixed inset-0 z-50 bg-black/60" onClick={handleOutsideClick}>
            <div className="relative w-[90%] md:w-[80%] lg:w-[500px] my-6 h-auto">
                <Card className={`transition-transform duration-300 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
                    <CardHeader>
                        <h2 className="text-lg font-bold text-center">{label}</h2>
                        <CardDescription className="text-center mt-2">
                            Please provide a reason for reporting this review.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {errors && <div className="mb-4 p-2 bg-red-600 text-white rounded">{errors}</div>}
                        {successMessage && <div className="mb-4 p-2 bg-green-600 text-white rounded">{successMessage}</div>}
                        <Input
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Reason for reporting"
                            className="w-full mb-4"
                            required
                        />
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                className="bg-gray-600 text-white hover:bg-gray-700"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit Report"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
    return (
        <Modal
            isOpen={reviewModal.isOpen}
            close={reviewModal.close}
            label='Report'
            content={content}
        />
    )
};

export default ReviewModal;
