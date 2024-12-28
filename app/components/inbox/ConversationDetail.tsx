'use client';

import { useEffect, useState, useRef } from "react";
import useWebSocket from "react-use-websocket";
import EmojiPicker from "emoji-picker-react";
import { MessageType } from "@/app/inbox/[id]/page";
import { ConversationType } from "@/app/inbox/page";
import { FiSend } from "react-icons/fi";
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
        conversation_id: number;
        body?: string; // Optional for "typing" events
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
    const [isTyping, setIsTyping] = useState(false);

    const messageDiv = useRef<HTMLDivElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const myUser = conversation.users?.find((user) => user.id == userId);
    const otherUser = conversation.users?.find((user) => user.id != userId);

    const { lastJsonMessage, sendJsonMessage } = useWebSocket<WebSocketMessage>(
        `${process.env.NEXT_PUBLIC_WS_HOST}/ws/${conversation.id}/?token=${token}`,
        {
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
    // Scroll to the bottom of the chat
    const scrollToBottom = () => {
        if (messageDiv.current) {
            messageDiv.current.scrollTop = messageDiv.current.scrollHeight;
        }
    };

    // Handle typing event
    const handleTyping = () => {
        if (!isTyping) {
            sendJsonMessage({
                event: 'typing',
                data: {
                    name: myUser?.name,
                    conversation_id: conversation.id,
                    sent_to_id: otherUser?.id,
                },
            });
            setIsTyping(true);
        }
        setTimeout(() => setIsTyping(false), 4000);
    };

    // Handle incoming WebSocket messages
    useEffect(() => {
        if (lastJsonMessage) {
            console.log("Received WebSocket message:", lastJsonMessage);
    
            if (lastJsonMessage.event === "typing") {
                const { name } = lastJsonMessage.data;
    
                if (name !== myUser?.name) {
                    setIsTyping(true);
                    setTimeout(() => setIsTyping(false), 4000);
                }
            }
    
            if (lastJsonMessage.event === "chat_message") {
                const { name, body = '' } = lastJsonMessage.data;
    
                const isSentByCurrentUser = name === myUser?.name;
    
                const message: MessageType = {
                    id: '', // Assign a unique ID if needed
                    name,
                    body,
                    sent_to: isSentByCurrentUser ? (otherUser ?? { id: '', name: '' }) : (myUser ?? { id: '', name: '' }),
                    created_by: isSentByCurrentUser ? (myUser ?? { id: '', name: '' }) : (otherUser ?? { id: '', name: '' }),
                    conversationId: conversation.id,
                };
    
                setRealTimeMessages((prev) => [...prev, message]);
                scrollToBottom(); // Ensure this is called when a new message is added
            }
        }
    }, [lastJsonMessage]);
    
            

    // Send a new message
    const sendMessage = () => {
        if (newMessage.trim()) {
            const message: MessageType = {
                id: '', // Assign a unique ID if needed
                name: myUser?.name ?? '',
                body: newMessage,
                sent_to: otherUser ?? { id: '', name: '' },
                created_by: myUser ?? { id: '', name: '' },
                conversationId: conversation.id,
            };

            // Update local state immediately for sender
            setRealTimeMessages((prev) => [...prev, message]);

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


    // Add emoji to the input field
    const onEmojiClick = (emojiObject: any) => {
        setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    };

    return (
        <div className="flex flex-col space-y-4">
            {/* Chat Messages */}
            <div ref={messageDiv} className="flex-1 overflow-auto p-4 bg-[url('/bg.jpg')] rounded-lg shadow-md max-h-[70vh]">
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
                            style={{
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                whiteSpace: 'pre-wrap',
                            }}
                        >
                            <span className="text-sm font-semibold">{message.created_by.name}</span>
                            <p className="text-sm font-normal py-2.5">{message.body}</p>
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                Delivered
                            </span>
                        </div>
                    </div>
                ))}
                {/* Typing Indicator */}
                {isTyping && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
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
                            handleTyping();
                        }}
                        type="text"
                        placeholder="Type a message..."
                        className="w-full p-3 pl-4 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white dark:border-gray-600 dark:bg-gray-700 placeholder-gray-400"
                    />
                    {showEmojiPicker && (
                        <div ref={emojiPickerRef} className="absolute top-full right-4 mt-2 z-10">
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                </div>
                <button className="text-gray-400 dark:text-gray-500 text-xl" onClick={() => setShowEmojiPicker((prev) => !prev)}>
                    😊
                </button>
                <FiSend className="text-gray-400 text-3xl dark:text-gray-500 cursor-pointer" onClick={sendMessage} />
            </div>
        </div>
    );
};

export default ConversationDetail;
