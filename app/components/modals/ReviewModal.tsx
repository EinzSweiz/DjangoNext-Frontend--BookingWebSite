'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useReviewModal from '@/app/hooks/useReviewModal';
import Modal from './Modal';

const ReviewModal = () => {
    const reviewModal = useReviewModal();
    const [reason, setReason] = useState<string>('');

    const handleSubmit = () => {
        console.log(`Reported Review ID: ${reviewModal}, Reason: ${reason}`);
        reviewModal.close(); // Close the modal after submission
    };

    const content = (
        <Card className="w-full h-full p-6 max-w-4xl mx-auto bg-gray-900 text-gray-100 rounded-lg shadow-lg">
            <CardHeader>
                <CardDescription className="text-center mt-2 text-2xl text-gray-300">
                    Please provide a reason for reporting this review.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-center space-y-4">
                <Input
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for reporting"
                    className="w-full max-w-lg bg-gray-800 text-gray-100 border-gray-600 placeholder-gray-500"
                    required
                />
                <div className="flex justify-center w-full mt-6">
                    <Button
                        type="button"
                        className="w-full max-w-md bg-red-600 text-white hover:bg-red-700 py-3 text-lg font-bold rounded-lg"
                        onClick={handleSubmit}
                    >
                        Report
                    </Button>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <Modal
            isOpen={reviewModal.isOpen}
            close={reviewModal.close}
            label="Report"
            content={content}
        />
    );
};

export default ReviewModal;
