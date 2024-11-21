"use client"
import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import apiService from "@/app/services/apiService";
import ConversationDetail from "@/app/components/inbox/ConversationDetail";
import { UserType } from "../page";
import { getUserId, getAccessToken } from "../../lib/actions";

export type MessageType = {
    id: string;
    name: string;
    body: string;
    conversationId: string;
    sent_to: UserType;
    created_by: UserType;
};

interface ConversationPageProps {
    params: { id: string | undefined }; // Expecting the dynamic part of the URL
}

const ConversationPage: React.FC<ConversationPageProps> = ({ params }) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [conversation, setConversation] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedUserId = await getUserId();
            const fetchedToken = await getAccessToken();

            if (!fetchedUserId || !fetchedToken) {
                setLoading(false);
                return;  // User is not authenticated
            }

            setUserId(fetchedUserId);
            setToken(fetchedToken);

            // Fetch conversation data
            const conversationResponse = await apiService.get(`/api/chat/${params.id}/`);
            setConversation(conversationResponse);
            setLoading(false);
        };

        fetchData();
    }, [params.id]); // Effect runs whenever `params.id` changes

    if (loading) {
        return (
            <main className="max-w-[1500px] mx-auto px-6 py-12">
                <p>Loading...</p>
            </main>
        );
    }

    if (!userId || !token) {
        return (
            <main className="max-w-[1500px] mx-auto px-6 py-12">
                <p>You need to be authenticated...</p>
            </main>
        );
    }

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            {conversation && (
                <ConversationDetail 
                    token={token}
                    userId={userId}
                    messages={conversation.messages}
                    conversation={conversation.conversation}
                />
            )}
        </main>
    );
}

export default ConversationPage;
