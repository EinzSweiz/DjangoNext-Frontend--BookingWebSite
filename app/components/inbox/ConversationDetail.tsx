"use client";

import { useEffect, useState, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import EmojiPicker from "emoji-picker-react";
import { FiSend } from "react-icons/fi";
import Image from "next/image";

/**
 * -------------------
 * Type Definitions
 * -------------------
 */
export interface UserType {
  id: string;
  name: string;
  avatar_url?: string;
}

export interface MessageType {
  id: string;
  name: string;
  body: string;
  created_by: UserType;
  sent_to: UserType;
  conversationId: number;
}

export interface ConversationType {
  id: number;
  users?: UserType[];
  // ...any other fields
}

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

/**
 * -------------------
 * Component
 * -------------------
 */
const ConversationDetail: React.FC<ConversationDetailProps> = ({
  conversation,
  userId,
  token,
  messages,
}) => {
  // Unified local state for all messages (initial + real-time)
  const [chatMessages, setChatMessages] = useState<MessageType[]>(messages);

  // UI states
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Refs
  const messageDiv = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Identify current user and other user
  const myUser = conversation.users?.find((user) => user.id == userId);
  const otherUser = conversation.users?.find((user) => user.id != userId);

  // WebSocket hook
  const {
    lastJsonMessage,
    lastMessage,
    sendJsonMessage,
    readyState,
  } = useWebSocket<WebSocketMessage>(
    `${process.env.NEXT_PUBLIC_WS_HOST}/ws/${conversation.id}/?token=${token}`,
    {
      shouldReconnect: () => true,
    }
  );

  /**
   * -------------------------------
   * Debug logging - helps diagnose
   * -------------------------------
   */
  // 1. Log WebSocket ready state
  useEffect(() => {
    const connectionStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    console.log(
      "WebSocket readyState:",
      connectionStates[readyState] ?? readyState
    );
  }, [readyState]);

  // 2. Log the raw lastMessage whenever it changes
  useEffect(() => {
    if (!lastMessage) return;
    console.log("🔹 Raw lastMessage data:", lastMessage.data);
    // Optional: Try to parse it as JSON
    try {
      const parsed = JSON.parse(lastMessage.data);
      console.log("🔹 lastMessage parsed as JSON:", parsed);
    } catch (err) {
      console.warn("⚠️ Could not parse lastMessage as JSON:", err);
    }
  }, [lastMessage]);

  // 3. Log the structured lastJsonMessage whenever it changes
  useEffect(() => {
    if (!lastJsonMessage) return;
    console.log("🔸 lastJsonMessage from server:", lastJsonMessage);
  }, [lastJsonMessage]);

  /**
   * -------------------------------
   * Scroll to the bottom of the chat
   * whenever `chatMessages` changes
   * -------------------------------
   */
  useEffect(() => {
    if (messageDiv.current) {
      messageDiv.current.scrollTop = messageDiv.current.scrollHeight;
    }
  }, [chatMessages]);

  /**
   * -------------------------------
   * Close emoji picker on outside click
   * -------------------------------
   */
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

  /**
   * -------------------------------
   * Handle typing event
   * -------------------------------
   */
  const handleTyping = () => {
    if (!isTyping) {
      sendJsonMessage({
        event: "typing",
        data: {
          name: myUser?.name,
          conversation_id: conversation.id,
          sent_to_id: otherUser?.id,
        },
      });
      setIsTyping(true);
    }
    // Reset typing after 4s
    setTimeout(() => setIsTyping(false), 4000);
  };

  /**
   * -------------------------------
   * Listen for incoming WebSocket messages
   * -------------------------------
   */
  useEffect(() => {
    // If lastJsonMessage is `null`, it might mean the server didn't send valid JSON
    // or there's no new message from the server yet
    if (!lastJsonMessage) return;

    const { event, data } = lastJsonMessage;

    if (event === "typing") {
      const { name } = data;
      if (name !== myUser?.name) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 4000);
      }
    }

    if (event === "chat_message") {
      const { name, body = "" } = data;
      const isSentByCurrentUser = name === myUser?.name;

      // Construct the new message
      const incomingMessage: MessageType = {
        id: "", // Assign a unique ID if needed
        name,
        body,
        sent_to: isSentByCurrentUser
          ? otherUser ?? { id: "", name: "" }
          : myUser ?? { id: "", name: "" },
        created_by: isSentByCurrentUser
          ? myUser ?? { id: "", name: "" }
          : otherUser ?? { id: "", name: "" },
        conversationId: conversation.id,
      };

      // Update local messages
      setChatMessages((prev) => [...prev, incomingMessage]);
    }
  }, [lastJsonMessage, myUser, otherUser, conversation.id, sendJsonMessage]);

  /**
   * -------------------------------
   * Send a new message
   * -------------------------------
   */
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    // Construct a local message
    const localMessage: MessageType = {
      id: "",
      name: myUser?.name ?? "",
      body: newMessage,
      sent_to: otherUser ?? { id: "", name: "" },
      created_by: myUser ?? { id: "", name: "" },
      conversationId: conversation.id,
    };

    // 1. Optimistically update the UI
    setChatMessages((prev) => [...prev, localMessage]);

    // 2. Send to server via WebSocket
    sendJsonMessage({
      event: "chat_message",
      data: {
        body: newMessage,
        name: myUser?.name,
        sent_to_id: otherUser?.id,
        conversation_id: conversation.id,
      },
    });

    // 3. Reset input
    setNewMessage("");
  };

  /**
   * -------------------------------
   * Handle emoji selection
   * -------------------------------
   */
  const onEmojiClick = (emojiObject: any) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  /**
   * -------------------------------
   * Render
   * -------------------------------
   */
  return (
    <div className="flex flex-col space-y-4">
      {/* Chat Messages */}
      <div
        ref={messageDiv}
        className="flex-1 overflow-auto p-4 bg-[url('/bg.jpg')] rounded-lg shadow-md max-h-[70vh]"
      >
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-2.5 mb-4 ${
              message.created_by.name === myUser?.name
                ? "flex-row-reverse"
                : ""
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
                  ? "bg-black text-white rounded-s-xl rounded-se-xl dark:bg-gray-900"
                  : "bg-white text-black rounded-e-xl rounded-es-xl dark:bg-gray-800"
              }`}
              style={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              <span className="text-sm font-semibold">
                {message.created_by.name}
              </span>
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
            className="w-full p-3 pl-4 pr-12 border border-gray-300 rounded-full
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       text-gray-800 dark:text-white dark:border-gray-600
                       dark:bg-gray-700 placeholder-gray-400"
          />
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute top-full right-4 mt-2 z-10"
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
