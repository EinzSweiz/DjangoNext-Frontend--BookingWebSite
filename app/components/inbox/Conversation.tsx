'use client';

import { useRouter } from "next/navigation";
import { ConversationType } from "@/app/inbox/page";
import { format } from "date-fns";

interface ConversationProps {
    userId: string;
    conversation: ConversationType;
}

const Conversation: React.FC<ConversationProps> = ({ userId, conversation }) => {
    const router = useRouter();
    const otherUser = conversation.users.find((user) => user.id !== userId);

    // Format the "modified_at" date if it exists
    const formattedDate = conversation.modified_at
        ? format(new Date(conversation.modified_at), "PPpp") // e.g., Jan 1, 2024 at 12:30 PM
        : "Unknown";

    return (
        <div
            className="
                my-4 p-4 cursor-pointer 
                bg-white border border-gray-200 text-gray-800 
                rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 
                flex justify-between items-center

                /* Dark mode overrides */
                dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
            "
            onClick={() => router.push(`/inbox/${conversation.id}`)} // Navigate to conversation on click
        >
            {/* User Info */}
            <div className="flex items-center gap-4">
                {/* User Avatar */}
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden">
                    <img
                        src={otherUser?.avatar_url || "/default-avatar.png"}
                        alt={`${otherUser?.name}'s avatar`}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Name and Modified Date */}
                <div>
                    <p className="text-lg font-medium">{otherUser?.name || "Unknown User"}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Modified: <span className="font-medium">{formattedDate}</span>
                    </p>
                </div>
            </div>

            {/* Unread Messages Indicator */}
            {conversation.has_unread_messages && (
                <div className="flex items-center gap-1 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                    <span className="font-medium">New</span>
                </div>
            )}
        </div>
    );
};

export default Conversation;
