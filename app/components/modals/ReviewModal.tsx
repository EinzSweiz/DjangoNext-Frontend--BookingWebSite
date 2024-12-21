'use client'
import React, { useState } from "react";
import useReviewModal from "@/app/hooks/useReviewModal";

const ReviewModal = () => {
    const { isOpen, close } = useReviewModal();
    const [reason, setReason] = useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        // Handle the API call here
        console.log("Submitted reason:", reason);
        close(); // Close the modal after submitting
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Report Review</h3>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter your reason for reporting..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                />
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={close}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
