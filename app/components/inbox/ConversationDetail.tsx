'use client';

import CustomButton from "@/app/forms/CustomButton";
import { ConversationType } from "@/app/inbox/page";
import { useEffect, useState, useRef } from "react";
import useWebSocket from "react-use-websocket";
import EmojiPicker from "emoji-picker-react";
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

interface WebSocketMessage {
    event: string;
    data: {
        name: string;
        [key: string]: any; // Allows for additional properties if needed
    };
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
    const [showEmojiPicker, setshowEmojiPicker] = useState(false)
    const [isTyping, setIsTyping] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null); // Ref for emoji picker

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target as Node)
            ) {
                setshowEmojiPicker(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleTyping = () => {
        if (!isTyping) {
            sendJsonMessage({
                event: 'typing',
                data: {name: myUser?.name, conversation_id: conversation.id}
            });
            setIsTyping(true)
        }
        setTimeout(() => setIsTyping(false), 2000)
    }

    const { readyState, lastJsonMessage, sendJsonMessage } = useWebSocket(
        `${process.env.NEXT_PUBLIC_WS_HOST}/ws/${conversation.id}/?token=${token}`,
        {
            onError: (error) => console.error("WebSocket Error:", error),
            onClose: (event) => console.log("WebSocket Closed:", event),
            shouldReconnect: () => true,
        }
    );
    
    const onEmojiClick = (emojiObject: any) => {
        setNewMessage((prevMessage) => prevMessage + emojiObject.emoji)
    }

    useEffect(() => {
        console.log('Connection State Changed', readyState);
    }, [readyState]);

    useEffect(() => {
        if (
            lastJsonMessage &&
            typeof lastJsonMessage === "object" &&
            (lastJsonMessage as WebSocketMessage).event === "typing" &&
            (lastJsonMessage as WebSocketMessage).data.name !== myUser?.name
        ) {
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 2000); // Automatically hide after 2 seconds
        }
    }, [lastJsonMessage, myUser?.name]);
    

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
            <div ref={messageDiv} className="flex-1 overflow-auto p-4 bg-[url('/bg.jpg')] rounded-lg shadow-md max-h-[70vh]">
                {messages.concat(realtimeMessages).map((message, index) => (
                    <div
                        key={index}
                        className={`flex items-start gap-2.5 mb-4 ${
                            message.created_by.name === myUser?.name ? 'flex-row-reverse' : ''
                        }`}
                    >
                        {/* Profile Picture */}
                        <div
                            style={{
                                width: "32px", // Matches the width specified
                                height: "32px", // Matches the height specified
                                overflow: "hidden",
                                borderRadius: "50%",
                                flexShrink: 0,
                            }}
                        >
                            <Image
                                src={message.created_by.avatar_url || "/images.jpeg"}
                                alt={`${message.created_by.name} avatar`}
                                width={32}
                                height={32}
                                style={{
                                    objectFit: "cover",
                                    width: "100%",
                                    height: "100%",
                                }}
                            />
                        </div>
                        {/* Message Content */}
                        <div className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 ${
                            message.created_by.name === myUser?.name
                                ? 'bg-black text-white rounded-s-xl rounded-se-xl dark:bg-gray-900'
                                : 'bg-white text-black rounded-e-xl rounded-es-xl dark:bg-gray-800'
                        }`}>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <span className="text-sm font-semibold">
                                    {message.created_by.name}
                                </span>
                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                    {new Date(Date.now()).toLocaleTimeString()}
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

                    {/* Send Icon */}
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        {/* Emoji Picker Toggle Button */}
                        <button
                            className="text-gray-400 dark:text-gray-500 text-xl"
                            onClick={() => setshowEmojiPicker((prev) => !prev)}
                        >
                            ❤️
                        </button>

                        {/* Send Button */}
                        <FiSend
                            className="text-gray-400 text-3xl dark:text-gray-500 cursor-pointer"
                            onClick={() => {
                                // Add send message logic here
                            }}
                        />
                    </span>

                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                        <div
                            ref={emojiPickerRef} // Attach ref to emoji picker
                            className="absolute bottom-full right-4 z-10"
                        >
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConversationDetail;