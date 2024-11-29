import React from "react";

const MessageBubble = ({
    sender,
    message,
    timestamp,
    senderName,
}: {
    sender: 'user' | 'customer_service';
    message: string;
    timestamp: string;
    senderName: string;
}) => (
    <div className={`p-4 rounded-lg shadow-sm ${sender === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
        <p className="font-medium">{senderName}:</p>
        <p className="text-lg">{message}</p>
        <span className="text-xs text-gray-500">{new Date(timestamp).toLocaleString()}</span>
    </div>
);

export default MessageBubble
