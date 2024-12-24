'use client'
import React, { useEffect } from "react";
import useChatBotModal from "@/app/hooks/useChatBotModal";
import RightBottomModal from "./RightBottomModal";

const ChatBotModal: React.FC = () => {
  const chatbotModal = useChatBotModal();

  useEffect(() => {
    chatbotModal.open(); // Automatically open on app start
  }, []);

  const content = (
    <div className="space-y-4">
      <p>Hi! How can I help you?</p>
      <div className="space-y-2">
        <button className="btn">What is this website about?</button>
        <button className="btn">How do I contact support?</button>
        <button className="btn">Show me available properties</button>
      </div>
    </div>
  );

  return (
    <RightBottomModal
      label="ChatBot"
      isOpen={chatbotModal.isOpen}
      close={chatbotModal.close}
      content={content}
    />
  );
};

export default ChatBotModal;
