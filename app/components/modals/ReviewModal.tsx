'use client'

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import useReviewModal from "@/app/hooks/useReviewModal";
import Modal from "./Modal";
import { Button } from "@/components/ui/button";

const ReviewModal = () => {
    const [reason, setReason] = useState<string>('');
    const reviewModal = useReviewModal();

    const content = (
        <div className="flex items-center justify-center fixed inset-0 z-50 bg-black/60">
            <div className="relative w-[90%] md:w-[80%] lg:w-[500px] my-6 h-auto">
                <Card className="transition-transform duration-300">
                    <CardHeader>
                        <h2 className="text-lg font-bold text-center">Report</h2>
                        <CardDescription className="text-center mt-2">
                            Please provide a reason for reporting this review.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                onClick={reviewModal.close}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={() => console.log("Reason:", reason)}
                            >
                                Submit
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
            label="Report"
            content={content}
        />
    );
};

export default ReviewModal;
