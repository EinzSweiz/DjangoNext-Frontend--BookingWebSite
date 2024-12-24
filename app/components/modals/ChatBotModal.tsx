'use client'
import React, { useState, useEffect } from "react";
import apiService from "@/app/services/apiService";
import useChatBotModal from "@/app/hooks/useChatBotModal";
import RightBottomModal from "./RightBottomModal";

const ChatBotModal: React.FC = () => {
  const chatbotModal = useChatBotModal();
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you?", type: "bot" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const predefinedQuestions = [
    "What is this website about?",
    "How do I contact support?",
    "Show me available properties",
  ];
  
  useEffect(() => {
    chatbotModal.open(); // Open the modal on app load
  }, []); // Empty dependency array ensures this runs only once


  const handleQuestionClick = async (question: string) => {
    setMessages((prev) => [...prev, { text: question, type: "user" }]);
    setIsLoading(true);

    try {
      const response = await apiService.postWithoutToken("/api/chatbot", { question });

      if (response && response.response) {
        setMessages((prev) => [...prev, { text: response.response, type: "bot" }]);
        if (response.redirect) {
          setTimeout(() => {
            window.location.href = response.redirect;
          }, 1000);
        }
      } else {
        setMessages((prev) => [...prev, { text: "Something went wrong. Please try again.", type: "bot" }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { text: "Failed to connect to the server.", type: "bot" }]);
    }

    setIsLoading(false);
  };

  // Define the content to be passed to the modal
  const content = (
    <div className="chatbot-window">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div className="loading-indicator">Loading...</div>}
      </div>
      <div className="questions">
        {predefinedQuestions.map((q, index) => (
          <button key={index} onClick={() => handleQuestionClick(q)}>
            {q}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <RightBottomModal
      label="ChatBot"
      isOpen={chatbotModal.isOpen}
      close={chatbotModal.close}
      content={content} // Pass content here
    />
  );
};

export default ChatBotModal;
