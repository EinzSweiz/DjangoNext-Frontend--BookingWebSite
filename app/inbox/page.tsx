"use client"

import apiService from "../services/apiService"
import React, { useState, useEffect } from "react"
import { getUserId } from "../lib/actions"
import Conversation from "../components/inbox/Conversation"

export type UserType = {
    id: string
    name: string
    avatar_url?: string
}

export type ConversationType = {
    id: string
    users: UserType[]
    modified_at: string
}

const InboxPage = () => {
    const [userId, setUserId] = useState<string | null>(null)
    const [conversations, setConversations] = useState<ConversationType[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const userId = await getUserId()
            if (!userId) {
                setUserId(null)
                return
            }
            setUserId(userId)

            const conversationsData = await apiService.getWithToken('/api/chat/')
            if (conversationsData) {
                setConversations(conversationsData)
            }
        }

        fetchData()
    }, []) // This will run once on mount

    if (userId === null) {
        return (
            <main className="max-w-[2000px] max-auto py-12 px-6">
                <p>You need to be authenticated...</p>
            </main>
        )
    }

    return (
        <main className="max-w-[2000px] mx-auto px-6 pb-6">
            <div className="flex items-center justify-center h-32">
                <h1 className="text-2xl">Inbox</h1>
            </div>
            {conversations.map((conversation: ConversationType) => {
                return (
                    <Conversation
                        conversation={conversation}
                        userId={userId}
                        key={conversation.id}
                    />
                )
            })}
        </main>
    )
}

export default InboxPage
