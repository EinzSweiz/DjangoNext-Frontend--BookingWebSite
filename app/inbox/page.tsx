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
}

const InboxPage = async () => {
    const userId = await getUserId()
    if (!userId) {
        return (
            <main className="max-w-[2000px] max-auto py-12 px-6">
                <p>You need to be authenticated...</p>
            </main>
        )
    }
    const conversations = await apiService.getWithToken('/api/chat/')
    if (conversations) { 

        return (
            <main className="max-w-[2000px] mx-auto px-6 pb-6">
                <h1 className="my-6 text-2xl"> Inbox</h1>
                {conversations.map((conversation:ConversationType) => {
                    return (
                        <Conversation conversation={conversation} userId={userId} key={conversation.id}/> 
                    )
                })}

            </main>

        )
    } else {
        return (
            <main className="max-w-[2000px] mx-auto px-6 pb-6">
                <h1 className="my-6 text-2xl"> Inbox</h1>
                {conversations.map((conversation:ConversationType) => {
                    return (
                        <Conversation conversation={conversation} userId={userId} key={conversation.id}/> 
                    )
                })}

            </main>

        )
    }
}

export default InboxPage