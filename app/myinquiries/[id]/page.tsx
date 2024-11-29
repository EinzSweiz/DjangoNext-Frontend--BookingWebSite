'use client'

import apiService from "@/app/services/apiService";
import { useEffect, useState } from 'react';
import React from 'react';

interface Inquiry {
    id: string;
    subject: string;
    messages: Message[];
    message: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    user_name: string;
    user_email: string;
}

interface Message {
    sender: 'user' | 'customer_service';
    message: string;
    timestamp: string;
}

const InquiryPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showStatusDetails, setShowStatusDetails] = useState(false);
    const [response, setResponse] = useState("");

    const userRole: 'user' | 'customer_service' = 'customer_service';
    const resolvedParams = React.use(params); // Check if this is correct for your environment

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setResponse(e.target.value);
    };

    useEffect(() => {
        if (resolvedParams) {
            const fetchInquiry = async () => {
                try {
                    const response = await apiService.getWithToken(`/api/inquiries/get/${resolvedParams.id}`);
                    setInquiry(response);
                } catch (error) {
                    setError('Error loading inquiry details.');
                }
            };
            fetchInquiry();
        }
    }, [resolvedParams]);

    const handleStatusChange = async (newStatus: string) => {
        if (!inquiry) return;

        try {
            await apiService.put(`/api/inquiries/get/${inquiry.id}/`, { status: newStatus });
            setInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleSave = async () => {
        if (!response) return;

        try {
            const payload = { message: response };
            await apiService.put(`/api/inquiries/get/${inquiry?.id}/`, payload);
            setResponse(""); // Clear the textarea after saving
        } catch (error) {
            console.error("Error saving response:", error);
        }
    };

    if (error) {
        return <p className="text-red-600">{error}</p>;
    }

    if (!inquiry) {
        return <p>Loading...</p>;
    }

    const toggleStatusDetails = () => {
        setShowStatusDetails((prev) => !prev);
    };

    return (
        <div className="p-6 font-sans grid grid-cols-12 gap-6">
            {/* Left Part (Subject & Messages) */}
            <div className="col-span-8 space-y-6">
                {/* Subject */}
                <div className="bg-blue-50 p-5 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-blue-800">Subject: {inquiry.subject}</h2>
                </div>

                {/* Messages */}
                <div className="space-y-6">
                    <div className={`p-4 rounded-lg shadow-sm bg-blue-100 text-blue-800`}>
                        <p className="font-medium">{inquiry.user_name}:</p>
                        <p className="text-lg">{inquiry.message}</p>
                    </div>
                    {inquiry.messages.map((msg, index) => (
                        <MessageBubble
                            key={index}
                            sender={msg.sender}
                            message={msg.message}
                            timestamp={msg.timestamp}
                            senderName={msg.sender === 'user' ? inquiry.user_name : 'Agent'}
                        />
                    ))}
                </div>
            </div>

            {/* Right Part (Status, User Info, and Toggle) */}
            <div className="col-span-4 space-y-6">
                {/* User Info */}
                <div className="bg-gray-200 p-5 rounded-lg shadow-md">
                    <UserInfoDisplay userName={inquiry.user_name} userEmail={inquiry.user_email} />
                </div>

                {/* Status and Status Details Toggle */}
                <div className="bg-white p-5 rounded-lg shadow-md">
                    <StatusDisplay
                        status={inquiry.status}
                        showStatusDetails={showStatusDetails}
                        toggleStatusDetails={toggleStatusDetails}
                        createdAt={inquiry.created_at}
                        updatedAt={inquiry.updated_at}
                        userRole={userRole}
                        onStatusChange={handleStatusChange}
                    />
                </div>
            </div>

            {/* Response Textarea (Fixed at bottom) */}
            <div className="col-span-12 left-0 right-0 p-5 bg-white shadow-md rounded-lg">
                <ResponseTextarea handleChange={handleChange} handleSave={handleSave} />
            </div>
        </div>
    );
};

// Reusable Components

const MessageBubble = ({
    sender,
    message,
    timestamp,
    senderName,
}: {
    sender: 'user' | 'customer_service';
    message: string;
    timestamp: string;
    senderName: string;
}) => (
    <div className={`p-4 rounded-lg shadow-sm ${sender === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
        <p className="font-medium">{senderName}:</p>
        <p className="text-lg">{message}</p>
        <span className="text-xs text-gray-500">{new Date(timestamp).toLocaleString()}</span>
    </div>
);

const UserInfoDisplay = ({ userName, userEmail }: { userName: string; userEmail: string }) => (
    <div>
        <p><strong>User:</strong> {userName}</p>
        <p><strong>Email:</strong> {userEmail}</p>
    </div>
);

const StatusDisplay = ({
    status,
    showStatusDetails,
    toggleStatusDetails,
    createdAt,
    updatedAt,
    userRole,
    onStatusChange,
}: {
    status: string;
    showStatusDetails: boolean;
    toggleStatusDetails: () => void;
    createdAt: Date;
    updatedAt: Date;
    userRole: 'user' | 'customer_service';
    onStatusChange: (newStatus: string) => void;
}) => {
    const [editableStatus, setEditableStatus] = useState<string>(status);

    const handleChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setEditableStatus(newStatus);
        onStatusChange(newStatus);
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
                {userRole === 'customer_service' ? (
                    <div>
                        <p className="font-semibold"><strong>Status:</strong></p>
                        <select
                            value={editableStatus}
                            onChange={handleChangeStatus}
                            className="mt-2 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300"
                        >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                ) : (
                    <p className="font-semibold"><strong>Status:</strong> {status}</p>
                )}
                <button
                    onClick={toggleStatusDetails}
                    className="mt-3 px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                    {showStatusDetails ? 'Hide Details' : 'Show Details'}
                </button>
            </div>
            {showStatusDetails && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                    <p><strong>Created At:</strong> {new Date(createdAt).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> {new Date(updatedAt).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
};

const ResponseTextarea = ({
    handleChange,
    handleSave,
}: {
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSave: () => void;
}) => (
    <div>
        <textarea
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300"
            placeholder="Type your response here..."
            onChange={handleChange}
        />
        <button
            onClick={handleSave}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
            Save Response
        </button>
    </div>
);

export default InquiryPage;
