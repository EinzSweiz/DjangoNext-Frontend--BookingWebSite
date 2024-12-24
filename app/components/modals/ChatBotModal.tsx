"use client";
import React, { useEffect, useState } from "react";
import useChatBotModal from "@/app/hooks/useChatBotModal";
import RightBottomModal from "./RightBottomModal";
import apiService from "@/app/services/apiService";

const ChatBotModal: React.FC = () => {
  const chatbotModal = useChatBotModal();
  const [conversation, setConversation] = useState<{ question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [typingResponse, setTypingResponse] = useState<string>("");
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  useEffect(() => {
    chatbotModal.open(); // Automatically open on app start
  }, []);

  const simulateTypingEffect = (text: string) => {
    let currentText = "";
    const typingSpeed = 50; // Typing speed in milliseconds

    const interval = setInterval(() => {
      if (currentText.length < text.length) {
        currentText += text[currentText.length];
        setTypingResponse(currentText);
      } else {
        clearInterval(interval);
      }
    }, typingSpeed);
  };

  const handleSubmit = async (q: string) => {
    setLoading(true);
    setTypingResponse(""); // Clear previous response
    setActiveQuestion(q); // Set the active question to hide other content
    try {
      console.log("Question:", q);

      // Send the request
      const response = await apiService.postWithoutToken("/api/chatbot/", JSON.stringify({ question: q }), false);
      console.log("Response:", response);

      // Simulate the typing effect for the answer
      setConversation((prev) => [...prev, { question: q, answer: "" }]);
      simulateTypingEffect(response.response);

      // Handle redirects
      if (response.redirect) {
        window.location.href = response.redirect;
      }
    } catch (error) {
      console.error("Failed to fetch chatbot response:", error);
      setConversation((prev) => [
        ...prev,
        { question: q, answer: "Sorry, something went wrong!" },
      ]);
    } finally {
      setLoading(false);
      setActiveQuestion(null); // Reset the active question once the answer is displayed
    }
  };

  const renderConversation = () => (
    <div className="mt-4 w-full">
      {conversation.map((item, index) => (
        <div key={index} className="mb-2">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Q:</strong> {item.question}
          </p>
          <p className="text-sm text-gray-900 dark:text-gray-100">
            <strong>A:</strong> {item.answer}
          </p>
        </div>
      ))}
    </div>
  );

  const content = activeQuestion ? (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col items-center py-8 px-4">
        {loading && <div className="text-lg text-gray-500">🤖 Thinking...</div>}
        {!loading && typingResponse && (
          <p className="text-sm text-gray-900 dark:text-gray-100">
            <strong>A:</strong> {typingResponse}
          </p>
        )}
      </div>
    </div>
  ) : (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col items-center pb-3 px-3 sm:pb-4 sm:px-4">
        <img
          className="w-10 h-10 sm:w-16 sm:h-16 mb-1 sm:mb-2 rounded-full shadow-lg"
          src="/bot_image.jpg"
          alt="ChatBot"
        />
        <h5 className="mb-1 text-xs sm:text-lg font-medium text-gray-900 dark:text-white">
          ChatBot
        </h5>
        <span className="text-[10px] sm:text-sm text-gray-500 dark:text-gray-400 text-center">
          How can I assist you today?
        </span>
        <div className="flex flex-col mt-2 sm:mt-3 space-y-1 sm:space-y-2 w-full">
          <button
            onClick={() => handleSubmit("What is this website about?")}
            className="w-full px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            What is this website about?
          </button>
          <button
            onClick={() => handleSubmit("How do I contact support?")}
            className="w-full px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            How do I contact support?
          </button>
          <button
            onClick={() => handleSubmit("Show me available properties")}
            className="w-full px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Show me available properties
          </button>
        </div>
        {renderConversation()}
      </div>
    </div>
  );

  return (
    <RightBottomModal
      isOpen={chatbotModal.isOpen}
      close={chatbotModal.close}
      content={content}
    />
  );
};

export default ChatBotModal;
