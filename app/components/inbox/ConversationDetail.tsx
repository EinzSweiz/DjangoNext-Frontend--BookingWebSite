'use client';

import CustomButton from "@/app/forms/CustomButton";
import { ConversationType } from "@/app/inbox/page";
import { useEffect, useState, useRef } from "react";
import useWebSocket from "react-use-websocket";
import EmojiPicker from "emoji-picker-react";
import { MessageType } from "@/app/inbox/[id]/page";
import { FiSend } from "react-icons/fi";
import { UserType } from "@/app/inbox/page";
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
        [key: string]: any;
    };
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({
    conversation,
    userId,
    token,
    messages,
}) => {
    const [newMessage, setNewMessage] = useState('');
    const [realtimeMessages, setRealTimeMessages] = useState<MessageType[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Keep isTyping, but we won't set it in handleTyping anymore.
    const [isTyping, setIsTyping] = useState(false);

    const messageDiv = useRef<HTMLDivElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const myUser = conversation.users?.find((user) => user.id == userId);
    const otherUser = conversation.users?.find((user) => user.id != userId);

    const { readyState, lastJsonMessage, sendJsonMessage } = useWebSocket(
        `${process.env.NEXT_PUBLIC_WS_HOST}/ws/${conversation.id}/?token=${token}`,
        {
            onError: (error) => console.error("WebSocket Error:", error),
            onClose: (event) => console.log("WebSocket Closed:", event),
            shouldReconnect: () => true,
        }
    );

    // Close emoji picker on outside click
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target as Node)
            ) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    // ==============
    // 1) Only SEND a "typing" event; do NOT set isTyping to true here.
    // ==============
    const handleTyping = () => {
        // We'll send the typing event to let the server know we're typing,
        // but we won't set "isTyping" locally. The *other* user will handle that on their end.
        sendJsonMessage({
            event: 'typing',
            data: { 
              name: myUser?.name, 
              conversation_id: conversation.id 
            },
        });
        // No local setIsTyping(true) here.
    };

    // ==============
    // 2) Show typing indicator ONLY if event is from the OTHER user
    // ==============
    useEffect(() => {
        if (
            lastJsonMessage &&
            typeof lastJsonMessage === "object"
        ) {
            const wsMessage = lastJsonMessage as WebSocketMessage;

            // Check if it's a "typing" event from someone else
            if (wsMessage.event === "typing") {
                if (wsMessage.data.name !== myUser?.name) {
                    // If the server says "User B is typing",
                    // we show "isTyping" for 2 seconds
                    setIsTyping(true);
                    setTimeout(() => setIsTyping(false), 2000);
                }
            }
            // Check if it's a chat_message, then add it
            if ("name" in wsMessage && "body" in wsMessage) {
                if (!myUser || !otherUser) {
                    console.error("User information is missing.");
                    return;
                }
                const isSentByCurrentUser = wsMessage.name === myUser.name;

                const message: MessageType = {
                    id: '', // Assign a unique ID if needed
                    name: wsMessage.name as string,
                    body: wsMessage.body as string,
                    sent_to: isSentByCurrentUser ? otherUser : myUser,
                    created_by: isSentByCurrentUser ? myUser : otherUser,
                    conversationId: conversation.id,
                };
                setRealTimeMessages((prev) => [...prev, message]);
            }
        }

        // always scroll to bottom
        scrollToBottom();
    }, [lastJsonMessage, myUser, otherUser]);

    // Send a new message
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

    // Scroll to the bottom of the chat
    const scrollToBottom = () => {
        if (messageDiv.current) {
            messageDiv.current.scrollTop = messageDiv.current.scrollHeight;
        }
    };

    // Add emoji to the input field
    const onEmojiClick = (emojiObject: any) => {
        setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    };

    return (
        <div className="flex flex-col space-y-4">
            {/* Chat Messages */}
            <div
                ref={messageDiv}
                className="flex-1 overflow-auto p-4 bg-[url('/bg.jpg')] rounded-lg shadow-md max-h-[70vh]"
            >
                {messages.concat(realtimeMessages).map((message, index) => (
                    <div
                        key={index}
                        className={`flex items-start gap-2.5 mb-4 ${
                            message.created_by.name === myUser?.name ? 'flex-row-reverse' : ''
                        }`}
                    >
                        {/* Profile Picture */}
                        <div className="w-8 h-8 overflow-hidden rounded-full flex-shrink-0">
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
                        <div
                            className={`flex flex-col w-full max-w-[320px] p-4 ${
                                message.created_by.name === myUser?.name
                                    ? 'bg-black text-white rounded-s-xl rounded-se-xl dark:bg-gray-900'
                                    : 'bg-white text-black rounded-e-xl rounded-es-xl dark:bg-gray-800'
                            }`}
                        >
                            <span className="text-sm font-semibold">
                                {message.created_by.name}
                            </span>
                            <p className="text-sm font-normal py-2.5">
                                {message.body}
                            </p>
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                Delivered
                            </span>
                        </div>
                    </div>
                ))}
                {/* 
                  3) Now 'isTyping' means the OTHER user is typing.
                     We show this only if the user is not me.
                */}
                {isTyping && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {otherUser?.name} is typing...
                    </div>
                )}
            </div>

            {/* Message Input Section */}
            <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-md">
                <div className="flex-1 relative">
                    <input
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value);
                            // Fire handleTyping to notify the server,
                            // but we do NOT set 'isTyping' locally.
                            handleTyping();
                        }}
                        type="text"
                        placeholder="Type a message..."
                        className="w-full p-3 pl-4 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white dark:border-gray-600 dark:bg-gray-700 placeholder-gray-400"
                    />

                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                        <div
                            ref={emojiPickerRef}
                            className="absolute top-full z-10"
                        >
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                </div>
                <button
                    className="text-gray-400 dark:text-gray-500 text-xl"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                >
                    😊
                </button>
                <FiSend
                    className="text-gray-400 text-3xl dark:text-gray-500 cursor-pointer"
                    onClick={sendMessage}
                />
            </div>
        </div>
    );
};

export default ConversationDetail;
