"use client";
import React, { useEffect } from "react";
import useChatBotModal from "@/app/hooks/useChatBotModal";
import RightBottomModal from "./RightBottomModal";

const ChatBotModal: React.FC = () => {
  const chatbotModal = useChatBotModal();

  useEffect(() => {
    chatbotModal.open(); // Automatically open on app start
  }, []);

  const content = (
    <div className="w-full max-w-xs bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col items-center pb-6 px-4">
        {/* Replace this src with your bot image path */}
        <img
          className="w-16 h-16 mb-2 rounded-full shadow-lg"
          src="/bot_image.jpg"
          alt="ChatBot"
        />
        <h5 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">
          ChatBot
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
          How can I assist you today?
        </span>
        <div className="flex flex-col mt-4 space-y-2 w-full">
          <button
            onClick={() => console.log("Question 1 clicked")}
            className="w-full px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            What is this website about?
          </button>
          <button
            onClick={() => console.log("Question 2 clicked")}
            className="w-full px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            How do I contact support?
          </button>
          <button
            onClick={() => console.log("Question 3 clicked")}
            className="w-full px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Show me available properties
          </button>
        </div>
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
