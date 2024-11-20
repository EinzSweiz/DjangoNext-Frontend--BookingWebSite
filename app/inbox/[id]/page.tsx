import ConversationDetail from "@/app/components/inbox/ConversationDetail";
import apiService from "@/app/services/apiService";
import { getAccessToken, getUserId } from "@/app/lib/actions";
import { UserType } from "../page";

export type MessageType = {
    id: string;
    name: string;
    body: string;
    conversation_id: string;
    sent_to: UserType;
    created_by: UserType;
};

type ConversationResponse = {
    conversation: {
        id: string;
        users: { id: string; name: string }[];
        modified_at: string;
    };
    messages: MessageType[];
};

// Ensure `params` matches Next.js PageProps expectations
interface PageProps {
    params: { id: string };
}

const ConversationPage = async ({ params }: PageProps) => {
    // Debugging logs
    console.log("Params:", params);

    if (!params?.id) {
        return (
            <main className="max-w-[2000px] mx-auto py-12 px-6">
                <p>Conversation ID is missing.</p>
            </main>
        );
    }

    const userId = await getUserId();
    const token = await getAccessToken();

    if (!userId || !token) {
        return (
            <main className="max-w-[2000px] mx-auto py-12 px-6">
                <p>You need to be authorized to view this page.</p>
            </main>
        );
    }

    try {
        const response = await apiService.getWithToken(`/api/chat/${params.id}`);
        const conversation: ConversationResponse = await response.json();

        if (!conversation.conversation || !conversation.messages) {
            throw new Error("Incomplete conversation data.");
        }

        return (
            <main className="max-w-[2000px] mx-auto px-6 pb-6">
                <ConversationDetail
                    conversation={conversation.conversation}
                    userId={userId}
                    token={token}
                    messages={conversation.messages}
                />
            </main>
        );
    } catch (error) {
        console.error("Error fetching conversation:", error);
        return (
            <main className="max-w-[2000px] mx-auto py-12 px-6">
                <p>Failed to load the conversation. Please try again later.</p>
            </main>
        );
    }
};

export default ConversationPage;
