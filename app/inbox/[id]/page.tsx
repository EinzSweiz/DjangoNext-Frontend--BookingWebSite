"use client"
import { useState, useEffect } from 'react';
import apiService from "@/app/services/apiService";
import ConversationDetail from "@/app/components/inbox/ConversationDetail";
import { UserType } from "../page";
import { getUserId, getAccessToken } from "../../lib/actions";
import { useParams } from 'next/navigation';  // Import useParams from next/navigation

export type MessageType = {
    id: string;
    name: string;
    body: string;
    conversationId: string;
    sent_to: UserType;
    created_by: UserType;
};

const ConversationPage = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [conversation, setConversation] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const { id } = useParams(); // Access dynamic route params using useParams

    useEffect(() => {
        if (!id) return; // Don't run if ID is undefined

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
            const conversationResponse = await apiService.get(`/api/chat/${id}/`);
            setConversation(conversationResponse);
            setLoading(false);
        };

        fetchData();
    }, [id]); // Effect runs whenever `id` changes

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
