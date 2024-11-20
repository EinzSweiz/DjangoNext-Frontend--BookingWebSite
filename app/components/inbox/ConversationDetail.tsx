"use client"
import CustomButton from "@/app/forms/CustomButton";
import { ConversationType } from "@/app/inbox/page";
import { useEffect, useState, useRef } from "react";
import useWebSocket from "react-use-websocket";
import { ReadyState } from "react-use-websocket";
import { MessageType } from "@/app/inbox/[id]/page";
import { UserType } from "@/app/inbox/page";

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
    const messageDiv = useRef<HTMLDivElement>(null); // Corrected type
    const [realtimeMessages, setRealTimeMessages] = useState<MessageType[]>([]);

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
        `${process.env.NEXT_PUBLIC_WS_HOST}/ws/${conversation.id}/?token=${token}`,
        {
            share: false,
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
                conversation_id: conversation.id,
            };
            setRealTimeMessages((realtimeMessages) => [...realtimeMessages, message]);
        }
        scrollToButton();
    }, [lastJsonMessage]);

    const sendMessage = async () => {
        console.log('SendMessage');
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

        setTimeout(() => {
            scrollToButton();
        }, 50);
    };

    const scrollToButton = () => {
        if (messageDiv.current) {
            messageDiv.current.scrollTop = messageDiv.current.scrollHeight; // Fixed capitalization
        }
    };

    return (
        <>
            <div ref={messageDiv} className="max-h-[400px] overflow-auto flex flex-col space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`w-[80%] py-4 px-6 rounded-xl text-black ${
                            message.created_by.name === myUser?.name ? 'ml-[20%] bg-green-200' : 'bg-gray-200'
                        }`}
                    >
                        <p className="font-bold text-gray-500">{message.created_by.name}</p>
                        <p>{message.body}</p>
                    </div>
                ))}
                {realtimeMessages.map((message, index) => (
                    <div
                        key={index}
                        className={`w-[80%] py-4 px-6 rounded-xl text-black ${
                            message.name === myUser?.name ? 'ml-[20%] bg-green-200' : 'bg-gray-200'
                        }`}
                    >
                        <p className="font-bold text-gray-500">{message.name}</p>
                        <p>{message.body}</p>
                    </div>
                ))}
            </div>
            <div className="mt-4 py-4 px-6 flex border border-gray-300 space-x-4 rounded-xl ">
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    type="text"
                    placeholder="Type your message..."
                    className="w-full p-2 bg-gray-200 rounded-xl"
                />
                <CustomButton
                    label="Send"
                    onClick={sendMessage}
                    className="w-[100px]"
                />
            </div>
        </>
    );
};

export default ConversationDetail;
