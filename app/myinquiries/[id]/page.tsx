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
import { getUserId } from "@/app/lib/actions";
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
    const [userId, setUserId] = useState('');
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
                    const userId = await getUserId()
                    if (userId) {
                        setUserId(userId)
                    }
                    console.log(response); // Add this line to inspect the inquiry data
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
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <img src="/undraw_real_time_analytics_re_yliv.svg" alt="" />
                    {/* Subject Card */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Subject: {inquiry.subject}</h2>
                    </div>
    
                    {/* User Info Card */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                        <UserInfoDisplay userName={inquiry.user_name} userEmail={inquiry.user_email} />
                    </div>
    
                    {/* Status Card */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                        <StatusDisplay
                            status={inquiry.status}
                            showStatusDetails={showStatusDetails}
                            toggleStatusDetails={toggleStatusDetails}
                            createdAt={inquiry.created_at}
                            updatedAt={inquiry.updated_at}
                            userRole="customer_service"
                            onStatusChange={handleStatusChange}
                        />
                        <AgentDisplay
                            agent={inquiry.customer_service}
                            onAgentChange={handleAssignAgent}
                        />
                    </div>
    
                    {/* Messages Card */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Messages</h3>
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
    
                {/* Response Textarea */}
                <div className="mt-6 bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                    <ResponseTextarea
                        handleChange={(e) => setResponse(e.target.value)}
                        handleSave={handleSave}
                    />
                </div>
            </div>
        );
};

export default InquiryPage;
