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
            const message: MessageType = {
                id: '',
                name: lastJsonMessage.name as string,
                body: lastJsonMessage.body as string,
                sent_to: otherUser as UserType,
                created_by: myUser as UserType,
                conversationId: conversation.id,
            };
            setRealTimeMessages((prev) => [...prev, message]);
        }
        scrollToBottom();
    }, [lastJsonMessage]);

    const sendMessage = () => {
        if (newMessage.trim()) {
            sendJsonMessage({
                event: 'chat_message',
                data: {
                    body: newMessage,
                    name: myUser?.name,
                    sent_to_id: otherUser?.id,
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
            <div ref={messageDiv} className="flex-1 overflow-auto p-4  bg-[url('/bg.jpg')] rounded-lg shadow-md max-h-[70vh]">
                {messages.concat(realtimeMessages).map((message, index) => (
                    <div
                        key={index}
                        className={`flex items-start gap-2.5 mb-4 ${
                            message.created_by.name === myUser?.name ? 'flex-row-reverse' : ''
                        }`}
                    >
                        {/* Profile Picture */}
                        <Image
                            src={message.created_by.avatar_url || '/images.jpeg'}
                            alt={`${message.created_by.name} avatar`}
                            width={48}  // Equivalent to w-12 (12 * 4px)
                            height={48} // Equivalent to h-12 (12 * 4px)
                            className="rounded-full max-w-full h-auto"
                        />
                        {/* Message Content */}
                        <div
                            className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 ${
                                message.created_by.name === myUser?.name
                                    ? 'bg-blue-500 text-white rounded-s-xl rounded-se-xl dark:bg-blue-700'
                                    : 'bg-gray-100 text-black rounded-e-xl rounded-es-xl dark:bg-gray-700'
                            }`}
                        >
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {message.created_by.name}
                                </span>
                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                    {new Date(Date.now()).toLocaleTimeString()} {/* Displays the current time */}
                                </span>
                            </div>
                            <p className="text-sm font-normal py-2.5">
                                {message.body}
                            </p>
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                Delivered
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Message Input Section */}
            <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-md">
                {/* Input Field */}
                <div className="flex-1 relative">
                    <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        type="text"
                        placeholder="Type a message..."
                        className="w-full p-3 pl-4 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white dark:border-gray-600 dark:bg-gray-700 placeholder-gray-400"
                    />
                    {/* Add a subtle icon inside the input field */}
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                        <FiSend />
                    </span>
                </div>

                {/* Send Button */}
                <div className="flex-shrink-0">
                    <CustomButton
                        label="Send"
                        onClick={sendMessage}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium shadow-lg transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>

        </div>
    );
};

export default ConversationDetail;
