'use client'
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
        <Card className="w-full h-full p-6 max-w-4xl mx-auto">
            <CardHeader>
                <CardDescription className="text-center mt-2 text-2xl">
                    Please provide a reason for reporting this review.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-center space-y-4">
                <Input
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for reporting"
                    className="w-full max-w-lg"
                    required
                />
                <div className="flex justify-end space-x-10 w-full max-w-lg">
                    <Button
                        type="button"
                        className="bg-gray-600 text-white hover:bg-gray-700"
                        onClick={reviewModal.close}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={handleSubmit}
                    >
                        Submit
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
