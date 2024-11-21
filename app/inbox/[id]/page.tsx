'use client'

import React, { useState, useEffect } from 'react';
import apiService from "@/app/services/apiService";
import ConversationDetail from "@/app/components/inbox/ConversationDetail";
import { getUserId, getAccessToken } from "../../lib/actions";
import { UserType } from "../page";

export type MessageType = {
    id: string;
    name: string;
    body: string;
    conversationId: string;
    sent_to: UserType;
    created_by: UserType;
}

interface ConversationPageProps {
    params: {
        id: string
    }
}

export default function ConversationPage({params: {id}}: ConversationPageProps) {
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [conversation, setConversation] = useState<any>(null);  // you can improve typing here
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

            try {
                const conversationResponse = await apiService.get(`/api/chat/${id}/`);
                setConversation(conversationResponse);
            } catch (error) {
                console.error("Error fetching conversation:", error);
                // You can set some error state here if needed
            }
            setLoading(false);
        };

        fetchData();
    }, [id]);  // runs when `params.id` changes

    if (loading) {
        return (
            <main className="max-w-[1500px] max-auto px-6 py-12">
                <p>Loading...</p>
            </main>
        );
    }

    if (!userId || !token) {
        return (
            <main className="max-w-[1500px] max-auto px-6 py-12">
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

// export default ConversationPage;
