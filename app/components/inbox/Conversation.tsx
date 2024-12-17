'use client'

import { useRouter } from "next/navigation"
import { ConversationType } from "@/app/inbox/page"
import { format } from "date-fns"

interface ConversationProps {
    userId: string
    conversation: ConversationType
}

const Conversation: React.FC<ConversationProps> = ({
    userId,
    conversation
}) => {
    const router = useRouter()
    const otherUser = conversation.users.find((user) => user.id !== userId)

    // Format the "modified_at" date if it exists
    const formattedDate = conversation.modified_at
        ? format(new Date(conversation.modified_at), "PPpp") // e.g., Jan 1, 2024 at 12:30 PM
        : "Unknown"

    return (
        <div className="my-4 px-6 py-4 cursor-pointer border border-gray-300 rounded-xl">
            {/* Other user's name */}
            <p className="mb-2 text-xl font-semibold">{otherUser?.name}</p>

            {/* Go to conversation link */}
            <p
                onClick={() => router.push(`/inbox/${conversation.id}`)}
                className="text-airbnb-dark hover:underline"
            >
                Go to conversation
            </p>

            {/* Modified at section */}
            <p className="mt-4 text-sm text-gray-500">
                Modified at: <span className="font-medium">{formattedDate}</span>
            </p>
        </div>
    )
}

export default Conversation
