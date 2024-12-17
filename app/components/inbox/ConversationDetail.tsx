'use client';

import CustomButton from "@/app/forms/CustomButton";
import { ConversationType } from "@/app/inbox/page";
import { useEffect, useState, useRef } from "react";
import useWebSocket from "react-use-websocket";
import { MessageType } from "@/app/inbox/[id]/page";
import { UserType } from "@/app/inbox/page";
import { FiSend } from 'react-icons/fi';
import Image from "next/image";

interface ConversationDetailProps {
    conversation: ConversationType;
    token: string;
    userId: string;
    messages: MessageType[];
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({
    conversation,
    userId,
    token,
    messages,
}) => {
    const [newMessage, setNewMessage] = useState('');
    const myUser = conversation.users?.find((user) => user.id == userId);
    const otherUser = conversation.users?.find((user) => user.id != userId);
    const messageDiv = useRef<HTMLDivElement>(null);
    const [realtimeMessages, setRealTimeMessages] = useState<MessageType[]>([]);

    const { readyState, lastJsonMessage, sendJsonMessage } = useWebSocket(
        `${process.env.NEXT_PUBLIC_WS_HOST}/ws/${conversation.id}/?token=${token}`,
        {
            onError: (error) => console.error("WebSocket Error:", error),
            onClose: (event) => console.log("WebSocket Closed:", event),
            shouldReconnect: () => true,
        }
    );

    useEffect(() => {
        console.log('Connection State Changed', readyState);
    }, [readyState]);

    useEffect(() => {
        if (
            lastJsonMessage &&
            typeof lastJsonMessage === 'object' &&
            'name' in lastJsonMessage &&
            'body' in lastJsonMessage
        ) {
            if (!myUser || !otherUser) {
                console.error("User information is missing.");
                return;  // Early exit if users are missing
            }

            const isSentByCurrentUser = lastJsonMessage.name === myUser.name;

            const message: MessageType = {
                id: '',  // Assign a unique ID if needed
                name: lastJsonMessage.name as string,
                body: lastJsonMessage.body as string,
                sent_to: isSentByCurrentUser ? otherUser : myUser,  // Set the recipient
                created_by: isSentByCurrentUser ? myUser : otherUser, // Set the sender
                conversationId: conversation.id,
            };
            setRealTimeMessages((prev) => [...prev, message]);
        }
        scrollToBottom();
    }, [lastJsonMessage, myUser, otherUser]);

    const sendMessage = () => {
        if (newMessage.trim()) {
            if (!myUser || !otherUser) {
                console.error("User information is missing.");
                return;
            }

            sendJsonMessage({
                event: 'chat_message',
                data: {
                    body: newMessage,
                    name: myUser.name,
                    sent_to_id: otherUser.id,
                    conversation_id: conversation.id,
                },
            });
            setNewMessage('');
            scrollToBottom();
        }
    };

    const scrollToBottom = () => {
        if (messageDiv.current) {
            messageDiv.current.scrollTop = messageDiv.current.scrollHeight;
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            {/* Chat Container */}
            <div
                ref={messageDiv}
                className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg max-h-[70vh] bg-[url('/bg.jpg')] bg-cover"
            >
                {messages.concat(realtimeMessages).map((message, index) => (
                    <div
                        key={index}
                        className={`flex items-start gap-3 mb-4 transition-opacity duration-300 ${
                            message.created_by.name === myUser?.name
                                ? 'flex-row-reverse'
                                : ''
                        }`}
                    >
                        {/* Profile Picture */}
                        <Image
                            src={message.created_by.avatar_url || '/images.jpeg'}
                            alt={`${message.created_by.name} avatar`}
                            width={40}
                            height={40}
                            className="rounded-full object-cover shadow-md"
                        />
                        {/* Message Content */}
                        <div
                            className={`flex flex-col w-fit max-w-[320px] leading-1.5 p-4 text-sm ${
                                message.created_by.name === myUser?.name
                                    ? 'bg-blue-600 text-white rounded-2xl rounded-br-none'
                                    : 'bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none dark:bg-gray-700 dark:text-white'
                            } shadow-md`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">
                                    {message.created_by.name}
                                </span>
                                <span className="text-xs text-gray-400 dark:text-gray-300">
                                    {new Date(Date.now()).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                            <p className="py-1">{message.body}</p>
                        </div>
                    </div>
                ))}
            </div>
    
            {/* Message Input Section */}
            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-md">
                <div className="flex-1 relative">
                    <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        type="text"
                        placeholder="Type your message..."
                        className="w-full p-3 pl-5 pr-12 text-gray-800 dark:text-white border rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 placeholder-gray-400"
                    />
                    {/* Send Icon */}
                    <button
                        onClick={sendMessage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700 transition-all"
                    >
                        <FiSend size={20} />
                    </button>
                </div>
                {/* Send Button */}
                <div>
                    <CustomButton
                        label="Send"
                        onClick={sendMessage}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium shadow-md transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
    
};

export default ConversationDetail;
