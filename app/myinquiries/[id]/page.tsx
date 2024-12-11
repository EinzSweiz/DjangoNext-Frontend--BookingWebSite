'use client'

import apiService from "@/app/services/apiService";
import { useEffect, useState } from 'react';
import React from 'react';
import ResponseTextarea from "@/app/components/inquiry/ResponseTextarea";
import MessageBubble from "@/app/components/inquiry/MessageBubble";
import StatusDisplay from "@/app/components/inquiry/StatusDisplay";
import AgentDisplay from "@/app/components/inquiry/AssignAgentButton";
import UserInfoDisplay from "@/app/components/inquiry/UserInfoDisplay";
import { format } from 'date-fns';

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
    customer_service: string;
}

interface Message {
    sender: 'user' | 'customer_service';
    message: string;
    timestamp: string;
}

type Params = Promise<{ id: string }>


const InquiryPage = ({ params }: { params: Params}) => {
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showStatusDetails, setShowStatusDetails] = useState(false);
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    

    const userRole: 'user' | 'customer_service' = 'customer_service';
    const resolvedParams = React.use(params);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setResponse(e.target.value);
    };

    useEffect(() => {
        if (resolvedParams.id) {
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
    }, [resolvedParams.id]);

    const handleStatusChange = async (newStatus: string) => {
        if (!inquiry) return;
    
        try {
            await apiService.putWithoutImage(`/api/inquiries/update-status/${inquiry.id}/`, { status: newStatus });
            setInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleAssignAgent = async (newAgent: string) => {
        if (!inquiry) return;
        try {
            await apiService.putWithoutImage(`/api/inquiries/assign-inquiry/${inquiry.id}/`, { customer_service: newAgent });
            setInquiry((prev) => (prev ? { ...prev, customer_service: newAgent } : null));
        } catch (error) {
            console.error("Failed to assign agent:", error);
        }
    };

    const handleSave = async () => {
        if (!response) return;
        setIsLoading(true); // Show spinner
        try {
            await apiService.postWithoutImages(`/api/inquiries/add-message/${inquiry?.id}/`, { message: response, sender: userRole });
            setResponse('');
            setInquiry((prev) => prev && { ...prev, messages: [...prev.messages, { sender: userRole, message: response, timestamp: new Date().toISOString() }] });
        } catch (error) {
            console.error('Error saving response:', error);
        } finally {
            setIsLoading(false); // Hide spinner
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
        <div className="p-6 font-sans grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 bg-white dark:bg-gray-900">
            {/* Left Part (Subject & Messages) */}
            <div className="col-span-1 md:col-span-2 lg:col-span-8 space-y-6">
                {/* Subject */}
                <div className="bg-blue-50 dark:bg-blue-800 p-5 rounded-lg shadow-lg">
                    <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 dark:text-blue-100">Subject: {inquiry.subject}</h2>
                </div>

                {/* Messages */}
                <div className="space-y-6">
                    <div className={`p-4 rounded-lg shadow-sm bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100`}>
                        <p className="font-medium">{inquiry.user_name}:</p>
                        <p className="text-base sm:text-lg">{inquiry.message}</p>
                    </div>
                    {inquiry.messages.map((msg) => (
                        <MessageBubble
                            key={`${msg.sender}-${msg.timestamp}`}
                            sender={msg.sender}
                            message={msg.message}
                            timestamp={msg.timestamp}
                            senderName={msg.sender === 'user' ? inquiry.user_name : 'Agent'}
                        />
                    ))}
                </div>
            </div>

            {/* Right Part (Status, User Info, and Toggle) */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4 space-y-6">
                {/* User Info */}
                <div className="bg-gray-200 dark:bg-gray-800 p-5 rounded-lg shadow-md">
                    <UserInfoDisplay userName={inquiry.user_name} userEmail={inquiry.user_email} />
                </div>

                {/* Status and Status Details Toggle */}
                <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-md">
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
                <AgentDisplay
                    agent={inquiry.customer_service}
                    onAgentChange={handleAssignAgent}
                />
            </div>

            {/* Response Textarea (Fixed at bottom) */}
            <div className="col-span-1 md:col-span-2 lg:col-span-12 left-0 right-0 p-5 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <ResponseTextarea handleChange={handleChange} handleSave={handleSave} />
            </div>
        </div>
    );
};

export default InquiryPage;
