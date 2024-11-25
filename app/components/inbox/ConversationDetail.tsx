'use client'
import CustomButton from "@/app/forms/CustomButton";
import { ConversationType } from "@/app/inbox/page";
import { useEffect, useState, useRef } from "react";
import useWebSocket from "react-use-websocket";
import { MessageType } from "@/app/inbox/[id]/page";
import { UserType } from "@/app/inbox/page";
import { FiSend } from 'react-icons/fi'; // You can use any other icons as well

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
            onError: (error) => {
                console.error("WebSocket Error:", error);
            },
            onClose: (event) => {
                console.log("WebSocket Closed:", event);
            },
            shouldReconnect: () => true,
        }
    );

    useEffect(() => {
        console.log('Connection State Changed', readyState);
    }, [readyState]);

    useEffect(() => {
        console.log("Last JSON Message:", lastJsonMessage);
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
            setRealTimeMessages((realtimeMessages) => [...realtimeMessages, message]);
        }
        scrollToBottom();
    }, [lastJsonMessage]);

    const sendMessage = async () => {
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
    };

    const scrollToBottom = () => {
        if (messageDiv.current) {
            messageDiv.current.scrollTop = messageDiv.current.scrollHeight; // Scroll to the bottom of the chat
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            <div ref={messageDiv} className="flex-1 overflow-auto p-4 bg-gray-50 rounded-lg shadow-md max-h-[70vh]">
                {/* Display previous messages */}
                {messages.concat(realtimeMessages).map((message, index) => (
                    <div
                        key={index}
                        className={`max-w-[75%] py-3 px-5 rounded-lg ${
                            message.created_by.name === myUser?.name
                                ? 'ml-auto bg-blue-500 text-white'
                                : 'bg-gray-300 text-black'
                        }`}
                    >
                        <p className="font-medium text-sm">{message.created_by.name}</p>
                        <p className="text-base">{message.body}</p>
                    </div>
                ))}
            </div>

            <div className="flex items-center p-2 bg-white rounded-lg shadow-md border-t-2 border-gray-200">
                {/* Input field takes 5/6 of the space */}
                <div className="flex-5">
                    <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        type="text"
                        placeholder="Type a message..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                {/* Button takes 1/6 of the space */}
                <div className="flex-1">
                    <CustomButton
                        label={<FiSend />}
                        onClick={sendMessage}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full transition duration-200 text-xl w-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default ConversationDetail;
